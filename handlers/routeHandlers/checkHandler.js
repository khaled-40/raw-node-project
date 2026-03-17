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


handler._check.put = (requestProperties, callback) => {
    // check if the id is valid
    const id = typeof (requestProperties.body.id) === 'string'
        && requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;

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
    if (id) {
        if (protocol || url || method || successCodes || timeOutSeconds) {
            // lookup the data
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    let checkObject = parseJSON(checkData);
                    let token = typeof (requestProperties.headerObject.token) === 'string'
                        ? requestProperties.headerObject.token
                        : false;

                    // verify token
                    verifyTokenId(token, checkObject.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCodes) {
                                checkObject.successCodes = successCodes;
                            }
                            if (timeOutSeconds) {
                                checkObject.timeOutSeconds = timeOutSeconds;
                            }

                            // update the data
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        message: 'The data has been updated successfully!'
                                    })
                                } else {
                                    callback(500, {
                                        error: 'Updating the data failed!'
                                    })
                                }
                            })
                        } else {
                            callback(403, {
                                error: 'Authentication problem!'
                            })
                        }
                    })
                } else {
                    callback(500, {
                        error: 'Could not find the check data!'
                    })
                }
            })
        } else {
            callback(400, {
                error: 'You have to provide at least one field to update!'
            })
        }
    } else {
        callback(400, {
            error: 'Your id is invalid!'
        })
    }
};


handler._check.delete = (requestProperties, callback) => {
    // check if the id is valid
    const id = typeof (requestProperties.body.id) === 'string'
        && requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;

    if (id) {
        // lookup the check data
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                let token = typeof (requestProperties.headerObject.token) === 'string'
                    ? requestProperties.headerObject.token
                    : false;

                // verify token
                verifyTokenId(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        // delete the check data
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                // lookup the data on the user
                                data.read('users', parseJSON(checkData).userPhone, (err3, userData) => {
                                    if (!err3 && userData) {
                                        let userObject = parseJSON(userData);
                                        let userChecks = typeof (userObject.checks) === 'object'
                                            && userObject.checks instanceof Array
                                            ? userObject.checks
                                            : [];

                                        // remove the deleted check id from user's list of chceks
                                        let checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);

                                            // resave the user data
                                            userObject.checks = userChecks;
                                            data.update('users', userObject.phone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, {
                                                        message: 'Deleted the check successfully!'
                                                    })
                                                } else {
                                                    callback(500, {
                                                        error: 'There was a server side error!'
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                error: 'The check id that you are trying to remove was not found in the user!'
                                            })
                                        }
                                    } else {
                                        callback(500, {
                                            error: 'There was a server side error!'
                                        })
                                    }
                                })
                            } else {
                                callback(500, {
                                    error: 'There was a server side error!'
                                })
                            }
                        })
                    } else {
                        callback(403, {
                            error: 'Authentication error!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'Could not find the check data of the specific ID!'
                })
            }
        })
    } else {
        callback(404, {
            error: 'Your ID is invalid!'
        })
    }
};


module.exports = handler;