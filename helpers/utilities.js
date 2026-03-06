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

// export the module
module.exports = utilities;