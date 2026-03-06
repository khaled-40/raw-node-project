/**
 * Title: User Handle
 * Description: Handler to handle user related routes
 * Author: MD Khaled Masud Hamim
 * Date: 06/03/2026
 */

// dependencies
const { hash, parseJSON } = require("../../helpers/utilities");
const data = require("../../lib/data");

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'The methods could not be found'
        })
    }
}

handler._user = {};

// @TODO authentication
handler._user.post = (requestProperties, callback) => {
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
    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean'
        ? requestProperties.body.tosAgreement
        : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure the user does not already exist 
        data.read('users', phone, (err1) => {
            if (err1) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                };
                // store the user to db
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, {
                            error: 'User Created Successfully'
                        })
                    } else {
                        callback(500, {
                            error: 'Could not create user'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'There was a problem in the server side'
                })
            }
        })

    } else {
        callback(400, {
            error: 'You have a problem in your request'
        })
        console.log(firstName, lastName, password, tosAgreement, phone)
    }
};

handler._user.get = (requestProperties, callback) => {
    // check if the phone number is valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string'
        && requestProperties.queryStringObject.phone.trim().length === 11
        ? requestProperties.queryStringObject.phone
        : false;
    if (phone) {
        // lookup the user
        data.read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) };
            if (!err && user) {
                delete user.password;
                callback(200, user)
            } else {
                callback(404, {
                    error: 'Requested user was not found'
                })
            }
        })
    } else {
        callback(400, {
            error: 'The phone number is invalid'
        })
    }
};

// @TODO authentication
handler._user.put = (requestProperties, callback) => {
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
handler._user.delete = (requestProperties, callback) => {
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