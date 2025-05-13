import { createUser, deleteUser, loginUser, createUserWithoutPassword, createUserWithoutEmail } from '../../steps/user/user.js'
import { generateTestData } from '../../utils/helpers.js'

before(async () => {
    await generateTestData()
})

it('User', () => {
    describe(`CRUD User`, () => {
        createUser()
        loginUser()
        deleteUser()
    })

    describe(`Negativ - Create user without password and email`, () => {
        createUserWithoutPassword()
        createUserWithoutEmail()
    })

})
