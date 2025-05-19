export const restaurantCreationSchema = {
    "type": "object",
    "properties": {
        "_id": {
        "type": "string"
        },
        "name": {
        "type": "string"
        },
        "description": {
        "type": "string"
        },
        "user": {
        "type": "string"
        }
    },
    "required": [
        "_id",
        "name",
        "description",
        "user"
    ]
}