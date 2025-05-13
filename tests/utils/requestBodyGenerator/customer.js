import accountRequestBody from '../../data/user/create_account.json' assert { type: 'json' }
import { config } from '../../../config.js'
import { generateRandomEmail, generateRandomString } from '../helpers.js'


export async function getCreateUserRequestBody() {
    accountRequestBody.email = await generateRandomEmail()
    accountRequestBody.name = config[global.env].name
    accountRequestBody.surname = config[global.env].surname
    const password = await generateRandomString(16)
    accountRequestBody.password = password

    global.executionVariables['userPassword'] = password
    
    return accountRequestBody
}
