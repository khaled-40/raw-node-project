/**
 * Title: Utilities
 * Description: Important Utility Functions
 * Author: MD Khaled Masud Hamim
 * Date: 06/03/2026
 */

// dependencies
const crypto = require('crypto');
const environment = require('./environments');

// module scaffolding
const utilities = {};

// parse jsonString to object
utilities.parseJSON = (jsonString) => {
    let output = {};

    try {
        output = JSON.parse(jsonString)
    } catch {
        output = {};
    }

    return output;
}

// hash string
utilities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(str)
            .digest('hex')
        return hash;
    } else {
        return false;
    }
}

//create random string
utilities.createRandomString = (strLength) => {
    const length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const reandomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += reandomCharacter;
        }
        return output;
    }
    return false;
}

// export the module
module.exports = utilities;