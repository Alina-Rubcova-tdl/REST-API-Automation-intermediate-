import { createUser, deleteUserNotWrappedWithIt, loginUser} from '../../steps/user/user.js'
import { createRestaurant, deleteRestaurant, getRestaurant, updateRestaurant, getRemovedRestaurant, deleteAlreadyDeletedRestaurant } from '../../steps/restaurant/restaurant.js'
import { generateTestData } from '../../utils/helpers.js'

before(async () => {
    await generateTestData()
    await createUser()
    await loginUser()
})

after(async () => {
    await deleteUserNotWrappedWithIt()
})

it('Restaurant Test set', () => {
    describe(`CRUD Restaurant`, () => {
        createRestaurant()
        getRestaurant()
        updateRestaurant()
        getRestaurant()
        deleteRestaurant()
        getRemovedRestaurant() 
    })

    describe(`Restaurant negative`, () => {
        createRestaurant()
        deleteRestaurant()
        deleteAlreadyDeletedRestaurant()
    })

})