import { generateRandomString } from '../helpers.js'


export async function getCreateOrUpdateRestaurantRequestBody() {
    const requestBody = {
        "name": await generateRandomString(10),
         "description": await generateRandomString(16)
    }
    
    return requestBody
}
