import { createUser, deleteUserNotWrappedWithIt, loginUser} from '../../steps/user/user.js'
import { 
    createRestaurant, 
    deleteRestaurant, 
    getRestaurant, 
    updateRestaurant, 
    getRemovedRestaurant, 
    deleteAlreadyDeletedRestaurant, 
    getAllRestaurants,
    negativeCreateRestaurant} from '../../steps/restaurant/restaurant.js'
import { generateTestData, readCSVFile } from '../../utils/helpers.js'
import negativeScenarios from '../../data/restaurant/create_negative.json' assert {type: 'json'}

before(async () => {
    await generateTestData()
    await createUser()
    await loginUser()
})

after(async () => {
    await deleteUserNotWrappedWithIt()
})

it('Restaurant Test set', async() => {
    const requestBodies = await readCSVFile('tests/data/restaurant/create.csv')

    for (const requestBody of requestBodies){
        describe(`CRUD Restaurant`, () => {
            createRestaurant(requestBody)
            getRestaurant()
            updateRestaurant()
            getRestaurant()
            getAllRestaurants()
            deleteRestaurant()
            getRemovedRestaurant() 
        })
    }

    describe.skip(`Restaurant negative`, () => {
        createRestaurant()
        deleteRestaurant()
        deleteAlreadyDeletedRestaurant()
    })

    describe.skip(`Restaurant negative creation`, () => {
        for (const negativeScenario of negativeScenarios) {
            negativeCreateRestaurant(
                negativeScenario.requestBody, 
                negativeScenario.testCaseName, 
                negativeScenario.messageValue)
        }
    })

})