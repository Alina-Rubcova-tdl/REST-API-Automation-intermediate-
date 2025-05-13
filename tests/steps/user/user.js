import { request } from '../../utils/requests.js'
import { getCreateUserRequestBody } from '../../utils/requestBodyGenerator/customer.js'


export async function createUser() {
    it('Create user account', async function () {
        const requestBody = await getCreateUserRequestBody()
        await request(this, 'POST', '/user', requestBody, true, 
            {
                statusCode : 201,
                expectedValues: [
                                    {path: 'name', value: requestBody.name},
                                    {path: 'email', value: requestBody.email},
                                    {path: 'surname', value: requestBody.surname}
                                ],
                executionVariables: [
                                        {path: 'email', name: 'userEmail'}, 
                                    ]
            }
        )
    })
}

export async function loginUser() {
    it('Login user', async function () {
        const requestBody = {
            email: global.executionVariables['userEmail'], 
            password: global.executionVariables['userPassword']
        }
        
        await request(this, 'POST', '/login', requestBody, false, 
            {
                statusCode : 200,
                expectedFields: ['token'],
                expectedValues: [
                                    {path: 'message', value: "Login successful"},
                                ],
                executionVariables: [
                                        {path: 'token', name: 'accessToken'}, 
                                    ]
            }
        )
    })
}

export async function deleteUser() {
    it('Remove user account', async function () {
        await deleteUserNotWrappedWithIt()
    })
}

export async function deleteUserNotWrappedWithIt() {
    await request(this, 'DELETE', `/user`, undefined, true, 
        {
            statusCode : 200,
            expectedValues: [
                {path: 'message', value: "User and all associated restaurants and meals have been deleted."},
            ]
        }
    )
}

export async function createUserWithoutPassword() {
    it('Create user without password', async function () {
        const requestBody = await getCreateUserRequestBody()
        delete requestBody.password

        await request(this, 'POST', '/user', requestBody, true, 
            {
                statusCode : 400,
                expectedValues: [
                                    {path: 'message', value: "Password not provided"}
                                ]
            }
        )
    })
}

export async function createUserWithoutEmail() {
    it('Create user without email', async function () {
        const requestBody = await getCreateUserRequestBody()
        delete requestBody.email

        await request(this, 'POST', '/user', requestBody, true, 
            {
                statusCode : 400,
                expectedValues: [
                                    {path: 'message', value: "User validation failed: email: Path `email` is required."}
                                ]
            }
        )
    })
}