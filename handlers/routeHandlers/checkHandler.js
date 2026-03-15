/**
 * Title: Check Handle
 * Description: Handler to handle check related routes
 * Author: MD Khaled Masud Hamim
 * Date: 11/03/2026
 */

// dependencies

const { maxChecks } = require("../../helpers/environments");
const { hash, parseJSON, createRandomString } = require("../../helpers/utilities");
const data = require("../../lib/data");
const { verifyTokenId } = require("./tokenHandler");


// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'The methods could not be found'
        })
    }
}

handler._check = {};


handler._check.post = (requestProperties, callback) => {
    // validate data
    const protocol = typeof (requestProperties.body.protocol) === 'string'
        && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
        ? requestProperties.body.protocol
        : false;

    const url = typeof (requestProperties.body.url) === 'string'
        && requestProperties.body.url.trim().length > 0
        ? requestProperties.body.url
        : false;

    const method = typeof (requestProperties.body.method) === 'string'
        && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
        ? requestProperties.body.method
        : false;

    const successCodes = typeof (requestProperties.body.successCodes) === 'object'
        && requestProperties.body.successCodes instanceof Array
        ? requestProperties.body.successCodes
        : false;

    const timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === 'number'
        && requestProperties.body.timeOutSeconds % 1 === 0
        && requestProperties.body.timeOutSeconds >= 1
        && requestProperties.body.timeOutSeconds <= 5
        ? requestProperties.body.timeOutSeconds
        : false;

    if (protocol && url && method && successCodes && timeOutSeconds) {
        let token = typeof (requestProperties.headerObject.token) === 'string'
            ? requestProperties.headerObject.token
            : false;

        // look up the user phone by reading the token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                let userPhone = parseJSON(tokenData).phone;

                // lookup the user data using phone
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        verifyTokenId(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                let userObject = parseJSON(userData);
                                let userChecks = typeof (userObject) === 'object'
                                    && userObject.checks instanceof Array
                                    ? userObject.checks
                                    : [];
                                if (userChecks.length < maxChecks) {
                                    let checkId = createRandomString(20);
                                    let checkObject = {
                                        'id': checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeOutSeconds
                                    };

                                    // save the object in the checks folder
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add check id to the users object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    // return the new check data
                                                    callback(200, checkObject)
                                                } else {
                                                    callback(500, {
                                                        error: 'There was a server side error!'
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                error: 'There was a server side error saving the check object data'
                                            })
                                        }
                                    })
                                }
                            } else {
                                callback(403, {
                                    error: 'Authentication error'
                                })
                            }
                        })
                    } else {
                        callback(500, {
                            error: 'User could not be found'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'There was a server side error reading the token data'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request'
        })
    }
};

handler._check.get = (requestProperties, callback) => {
    // check if the id is valid
    const id = typeof (requestProperties.queryStringObject.id) === 'string'
        && requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
    if (id) {
        // lookup the check
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                let token = typeof (requestProperties.headerObject.token) === 'string'
                    ? requestProperties.headerObject.token
                    : false;

                // verify token
                verifyTokenId(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, parseJSON(checkData))
                    } else {
                        callback(403, {
                            error: 'Authentication Problem!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'There is a server side error!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in you request!'
        })
    }
};

// @TODO authentication
handler._check.put = (requestProperties, callback) => {

};

// @TODO authentication
handler._check.delete = (requestProperties, callback) => {

};


module.exports = handler;