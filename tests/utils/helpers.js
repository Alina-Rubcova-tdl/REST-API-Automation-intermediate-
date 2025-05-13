export async function generateTestData() {
    setEnvironment(process.argv.slice(process.argv.length - 1)[0])
}

function setEnvironment(env) {
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