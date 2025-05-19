import csv from 'csv-parser'
import fs from 'fs'
import { resolve } from 'path'

export async function generateTestData() {
    const env = process.env.npm_config_env || 'STG'
    global.env = env
}

export async function generateRandomEmail() {
    return `${Math.random().toString(36).substring(2,11)}@domain.com`
}

export async function generateRandomPassword() {
    return Math.random().toString(36).substring(2,11)
}

export async function generateRandomString(size = 12) {
    let randomString = ''

    while (randomString.length < size) {
       randomString += Math.random().toString(36).substring(2)
    }

    return randomString.substring(0, size)
}

export async function readCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const result = []

        fs.createReadStream(filePath).pipe(csv())
        .on('data', (data) => result.push(data))
        .on('end', () => resolve(result))
        .on('err', (err) => reject(err))
    }

    )
}