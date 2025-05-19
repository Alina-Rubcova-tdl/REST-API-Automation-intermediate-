import accountRequestBody from '../../data/user/create_account.json' assert { type: 'json' }
import { faker } from '@faker-js/faker'

export async function getCreateUserRequestBody() {
    accountRequestBody.email = faker.internet.email()
    accountRequestBody.name = faker.person.firstName()
    accountRequestBody.surname = faker.person.lastName()
    const password = faker.internet.password()
    accountRequestBody.password = password

    global.executionVariables['userPassword'] = password
    
    return accountRequestBody
}
