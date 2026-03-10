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

// @TODO authentication
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
            console.log(hashedPassword,user.password)
            if (hashedPassword === user.password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                }

                // store the token
                data.create('tokens',tokenId,tokenObject,(err2) => {
                    if(!err2){
                        callback(200,{tokenObject})
                    }else{
                        callback(500,{
                            error:'There was a problem in the server side!'
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

// @TODO authentication
handler._token.put = (requestProperties, callback) => {
    // check if the phone number is valid
    const phone = typeof (requestProperties.body.phone) === 'string'
        && requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;
    if (phone) {
        const firstName = typeof (requestProperties.body.firstName) === 'string'
            && requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
        const lastName = typeof (requestProperties.body.lastName) === 'string'
            && requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
        const phone = typeof (requestProperties.body.phone) === 'string'
            && requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
        const password = typeof (requestProperties.body.password) === 'string'
            && requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
        if (firstName || lastName || password) {
            // lookup the user
            data.read('users', phone, (err, uData) => {
                const userData = { ...parseJSON(uData) }
                if (!err && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hash(password);
                    }

                    // update in the database
                    data.update('users', phone, userData, (err2) => {
                        if (!err2) {
                            callback(200, {
                                "message": "User updated Successfully"
                            })
                        } else {
                            callback(500, {
                                error: "There was a problem in the serverside"
                            })
                        }
                    })
                } else {
                    callback(400, {
                        error: 'You have a problem in your request. Could not find the user'
                    })
                }
            })
        } else {
            callback(400, {
                error: 'You have a problem in your request'
            })
        }
    } else {
        callback(400, {
            error: 'The phone number is invalid'
        })
    }
};

// @TODO authentication
handler._token.delete = (requestProperties, callback) => {
    // check if the phone number is valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string'
        && requestProperties.queryStringObject.phone.trim().length === 11
        ? requestProperties.queryStringObject.phone
        : false;
    if (phone) {
        // lookup the user
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                data.delete('users', phone, (err1) => {
                    if (!err1) {
                        callback(200, {
                            "message": "user deleted successfully"
                        })
                    } else {
                        callback(500, {
                            error: 'There was a server side error'
                        })
                    }
                })
            } else {
                callback(404, {
                    error: 'could not find the user to delete!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'The phone number is invalid'
        })
    }
};


module.exports = handler;