import { faker } from '@faker-js/faker'


export async function getCreateOrUpdateRestaurantRequestBody() {
    const requestBody = {
        "name": faker.food.dish(),
         "description": faker.food.description()
    }
    
    return requestBody
}
