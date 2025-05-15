import addContext from 'mochawesome/addContext.js'
import supertest from 'supertest'
import { config } from '../../config.js'
import { expect, assert } from 'chai'
import getNestedValue from 'get-nested-value'

export async function request(context, method, path, body = undefined, auth = true, asserts = {statusCode : 200},  host = undefined, customHeaders = undefined) {
    const requestST = host ? supertest(host) : supertest(config[global.env].host)

    const headers = customHeaders ? customHeaders : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': `${config[global.env].xApiKey}`,
        ...(auth && {'Authorization': `Bearer ${global.executionVariables['accessToken']}`})
    }

    let response = null
    let responseBody

    switch (method) {
        case 'GET':
            response = await requestST.get(path).set(headers)
            responseBody = response.body

            await performValidation(
                responseBody, 
                asserts, 
                context, 
                method, 
                path, 
                headers, 
                response, 
                body
            )

            break
        case 'POST':
            response = await requestST.post(path).send(body).set(headers)
            responseBody = response.body

            await performValidation(
                responseBody, 
                asserts, 
                context, 
                method, 
                path, 
                headers, 
                response, 
                body
            )
     
            break
        case 'PATCH':
            response = await requestST.patch(path).send(body).set(headers)
            responseBody = response.body

            await performValidation(
                responseBody, 
                asserts, 
                context, 
                method, 
                path, 
                headers, 
                response, 
                body
            )

            break
        case 'DELETE':
            response = await requestST.delete(path).send(body).set(headers)
            responseBody = response.body

            await performValidation(
                responseBody, 
                asserts, 
                context, 
                method, 
                path, 
                headers, 
                response, 
                body
            )

            break
        case 'PUT':
            response = await requestST.put(path).send(body).set(headers)
            responseBody = response.body

            await performValidation(
                responseBody, 
                asserts, 
                context, 
                method, 
                path, 
                headers, 
                response, 
                body
            )

            break
        default:
            console.log('not valid request method provided')
    }
    
    addRequestInfoToReport(context, method, path, headers, response, body)
    
    return response
}

async function performValidation(responseBody, asserts, context, method, path, headers, response, body) {
    await validateStatusCode(response.statusCode, asserts.statusCode, context, method, path, headers, response, body)

    if (asserts.expectedFields) {
        await validateFieldsExists(responseBody, asserts.expectedFields, context, method, path, headers, response, body)
    }

    if (asserts.expectedValues) {
        await validateExpectedValues(responseBody, asserts.expectedValues, context, method, path, headers, response, body)
    }

    if (asserts.executionVariables) {
        await setExecutionVariables(responseBody, asserts.executionVariables)
    }

    if (asserts.expectedTypes){
        await validateExpectedTypes(responseBody, asserts.expectedTypes, context, method, path, headers, response, body)
    }

    if (asserts.expectedValuesInArrayOfObjects){
        await validateExpectedValuesInArrayOfObjects(
            responseBody, 
            asserts.expectedValuesInArrayOfObjects, context, method, path, headers, response, 
            asserts.expectedValuesInArrayOfObjects.key, 
            asserts.expectedValuesInArrayOfObjects.value, 
            body
        )
    }
}

async function validateStatusCode(actual, expected, context, method, path, headers, response, requestBody) {
    try {
        expect(actual).to.be.equal(expected)
    } catch(error) {
        addRequestInfoToReport(context, method, path, headers, response, requestBody)
        assert.fail(error.actual, error.expected, `Actual is ${error.actual}, but expected was ${error.expected}`)
    }
}

async function validateFieldsExists(body, fields, context, method, path, headers, response, requestBody) {
    fields.every(field => {
        try {
            expect(getNestedValue(field, body), `${field} present in body`).not.to.be.undefined
        } catch (error) {
            addRequestInfoToReport(context, method, path, headers, response, requestBody)
            assert.fail(error.actual, error.expected, `${field} field is not present in body`)
        }
    })
}

async function validateExpectedValuesInArrayOfObjects(body, fields, context, method, path, 
    headers, response, key, value, requestBody) {
    const objectToValidate = body.find(item => item[key] === value)
    
    if(!objectToValidate){
        assert.fail(key, value, `object with key ${key} and value ${value} not found`)
    }
    // fields.every(field => {
    //     try {
    //         expect(getNestedValue(field, body), `${field} present in body`).not.to.be.undefined
    //     } catch (error) {
    //         addRequestInfoToReport(context, method, path, headers, response, requestBody)
    //         assert.fail(error.actual, error.expected, `${field} field is not present in body`)
    //     }
    // })
}

async function validateExpectedValues(body, fields, context, method, path, headers, response, requestBody) {
    fields.forEach(field => {
        try {
            expect(getNestedValue(field.path, body), `${field.path} not equal to ${field.value}`).to.be.equal(field.value)
        } catch (error) {
            addRequestInfoToReport(context, method, path, headers, response, requestBody)
            const actual = getNestedValue(field.path, body)
            assert.fail(actual, field.value, `${field.path} expected value is ${field.value}, but actual was ${actual}`)
        }
    })
}

async function validateExpectedTypes(body, fields, context, method, path, headers, response, requestBody) {
    fields.forEach(field => {
        try {
            switch(field.type.toLowerCase()) {
                case 'number':
                    expect(getNestedValue(field.path, body)).to.be.a('number')
                    break
                case 'string':
                    expect(getNestedValue(field.path, body)).to.be.a('string')
                    break
                case 'boolean':
                    expect(getNestedValue(field.path, body)).to.be.a('boolean')
                    break
                case 'object':
                    expect(getNestedValue(field.path, body)).to.be.a('object')
                    break
                case 'array':
                    expect(getNestedValue(field.path, body)).to.be.an('array')
                    break
                default:
                    console.log(`not supported type provided - ${field.type}`)
            }
        } catch (error) {
            addRequestInfoToReport(context, method, path, headers, response, requestBody)
            const actual = getNestedValue(field.path, body)
            assert.fail(actual, field.type, `Expected type was "${field.type}", but received "${typeof actual}"`)
        }
    })
}

async function setExecutionVariables(body, variables) {
    variables.forEach(variable => {
        global.executionVariables[variable.name] = getNestedValue(variable.path, body)
    })
}

function addRequestInfoToReport(context, method, path, headers, response, body) {
    if(context){
        addContext(context, `${method} ${path}`)
        addContext(context, {
            title: 'REQUEST HEADERS',
            value: headers
        })
        if (body) {
            addContext(context, {
                title: 'REQUEST BODY',
                value: body
            })
        }
        addContext(context, {
            title: 'RESPONSE HEADERS',
            value: response.headers
        })
        addContext(context, {
            title: 'RESPONSE BODY',
            value: response.body
        })
    }
}