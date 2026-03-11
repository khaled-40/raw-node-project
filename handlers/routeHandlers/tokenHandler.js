/**
 * Title: Token Handler
 * Description: Handle token to authenticate the user
 * Author: MD Khaled Masud Hamim
 * Date: 07/03/2026
 */

// dependencies
const { hash, parseJSON, createRandomString } = require("../../helpers/utilities");
const data = require("../../lib/data");


// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'The methods could not be found'
        })
    }
}

handler._token = {};


handler._token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string'
        && requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;
    const password = typeof (requestProperties.body.password) === 'string'
        && requestProperties.body.password.trim().length > 0
        ? requestProperties.body.password
        : false;
    if (phone && password) {
        // look up the user
        data.read('users', phone, (err1, userData) => {
            const user = { ...parseJSON(userData) };
            const hashedPassword = hash(password);
            if (hashedPassword === user.password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                }

                // store the token
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, { tokenObject })
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Your password is invalid'
                })
            }
        })
    } else {
        callback(400, {
            error: 'Your phone is invalid'
        })
    }
};

handler._token.get = (requestProperties, callback) => {
    // check if the id is valid
    const id = typeof (requestProperties.queryStringObject.id) === 'string'
        && requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
    if (id) {
        // lookup the user
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token)
            } else {
                callback(404, {
                    error: 'Requested token was not found'
                })
            }
        })
    } else {
        callback(400, {
            error: 'The token number is invalid'
        })
    }
};

handler._token.put = (requestProperties, callback) => {
    // check if the phone number is valid
    const id = typeof (requestProperties.body.id) === 'string'
        && requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;
    const extend =
        typeof (requestProperties.body.extend) === 'boolean' &&
            requestProperties.body.extend === true
            ? true
            : false;

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            const tokenObject = { ...parseJSON(tokenData) };
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // store the updated token
                data.update('tokens', id, tokenObject, (err1) => {
                    if (!err1) {
                        callback(200, {
                            message: 'Token has been updated successfully'
                        })
                    } else {
                        callback(500, {
                            error: 'There was a server side error!'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Token already expired'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request'
        })
    }

};

handler._token.delete = (requestProperties, callback) => {
    // check if the token is valid
    const id = typeof (requestProperties.queryStringObject.id) === 'string'
        && requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
    if (id) {
        // lookup the user
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (err1) => {
                    if (!err1) {
                        callback(200, {
                            "message": "Token deleted successfully"
                        })
                    } else {
                        callback(500, {
                            error: 'There was a server side error'
                        })
                    }
                })
            } else {
                callback(404, {
                    error: 'Could not find token to delete!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'Your ID is invalid'
        })
    }
};

handler.verifyTokenId = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone
                && parseJSON(tokenData).expires > Date.now()
            ) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}


module.exports = handler;