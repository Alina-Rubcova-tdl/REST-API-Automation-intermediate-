import { request } from '../../utils/requests.js'
import { getCreateOrUpdateRestaurantRequestBody } from '../../utils/requestBodyGenerator/restaurant.js'
import { restaurantCreationSchema } from '../../data/schema/restaurant.js'

export async function createRestaurant(requestBody) {
    it('Create restaurant', async function () {

        await request(this, 'POST', '/restaurants', requestBody, true, 
            {
                statusCode : 201,
                expectedValues: [
                                    { path: 'name', value: requestBody.name },
                                    { path: 'description', value: requestBody.description },
                ],
                executionVariables: [
                                        { path: '_id', name: 'restaurantId' },
                                        { path: 'name', name: 'restaurantName' },
                                        { path: 'description', name: 'restaurantDescription' },
                                        { path: 'user', name: 'userId'},
                                    ],
                schema: restaurantCreationSchema
            }
        )
    })
}

export async function getRestaurant() {
    it('Get restaurant', async function () {
        await request(this, 'GET', `/restaurants/${global.executionVariables['restaurantId']}`, undefined, true, 
            {
                statusCode : 200,
                expectedValues: [
                    { path: 'name', value: global.executionVariables['restaurantName'] },
                    { path: 'description', value: global.executionVariables['restaurantDescription'] },
                    { path: '_id', value: global.executionVariables['restaurantId'] }
                ],
                expectedFields: ['user']
            }
        )
    })
}

export async function getAllRestaurants() {
    it('Get all restaurant', async function () {
        await request(this, 'GET', `/restaurants`, undefined, true, 
            {
                statusCode : 200,
                expectedValuesInArrayOfObjects: {
                    key: '_id',
                    value: global.executionVariables['restaurantId'],
                    fields: [
                        {path: 'name', value: executionVariables['restaurantName']}
                    ]
                }
            }
        )
    })
}

export async function deleteRestaurant() {
    it('Delete restaurant', async function () {
        await request(this, 'DELETE', `/restaurants/${global.executionVariables['restaurantId']}`, undefined, true, 
            {
                statusCode : 200,
                expectedValues: [
                    { path: 'message', value: 'Restaurant removed' }
                ]
            }
        )
    })
}

export async function deleteAlreadyDeletedRestaurant() {
    it('Delete already removed restaurant', async function () {
        await request(this, 'DELETE', `/restaurants/${global.executionVariables['restaurantId']}`, undefined, true, 
            {
                expectedValues: [
                    { path: 'message', value: 'Cannot find restaurant' }
                ],
                statusCode : 404
            }
        )
    })
}

export async function updateRestaurant() {
    it('Update restaurant', async function () {
        const requestBody = await getCreateOrUpdateRestaurantRequestBody()
        await request(this, 'PATCH', `/restaurants/${global.executionVariables['restaurantId']}`,
             requestBody, true, 
            {
                statusCode : 200,
                expectedFields: ['meals', 'created'],
                expectedValues: [
                                    {path: 'name', value: requestBody.name},
                                    {path: 'description', value: requestBody.description},
                                    {path: '_id', value:  global.executionVariables['restaurantId']},
                                    {path: 'user', value: global.executionVariables['userId']},

                                ],
                executionVariables: [
                                        {path: 'name', name: 'restaurantName'}, 
                                        {path: 'description', name: 'restaurantDescription'} 
                                    ]
            }
        )
    })
}

export async function getRemovedRestaurant() {
    it('Get removed restaurant', async function () {
        await request(this, 'GET', `/restaurants/${global.executionVariables['restaurantId']}`,
            undefined, true, 
            {
                expectedValues: [
                    {path: 'message', value: 'Cannot find restaurant'} 
                ],
                statusCode : 404
                
            }
        )
    })
}

export async function negativeCreateRestaurant(requestBody, testCaseName, messageValue) {
    it(testCaseName, async function () {
        await request(this, 'POST', '/restaurants', requestBody, true, 
            {
                statusCode : 400,
                expectedValues: [
                                    { path: 'message', value: messageValue }
                                ]
            }
        )
    })
}