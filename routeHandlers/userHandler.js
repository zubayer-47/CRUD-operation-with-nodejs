/*
 * Title: User Handler
 * Description: Handler for handle Users
 * Author: A B M Zubayer
 * Date: 14/08/21
 *
 */

// module scaffolding
const handlers = {};
const { hash, parseJSON } = require('../helpers/utilities');
const data = require('../lib/data');
const tokenHandler = require('./tokenHandler');

// sampleHandler
handlers.userHandler = (requestProperties, callback) => {
    const requestMethod = ['get', 'post', 'put', 'delete'];

    if (requestMethod.indexOf(requestProperties.method) > -1) {
        handlers._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Not found',
            method: requestProperties.method,
        });
    }
};

handlers._users = {};

handlers._users.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length
            ? requestProperties.body.lastName
            : false;

    const email =
        typeof requestProperties.body.email === 'string' &&
        requestProperties.body.email.trim().length
            ? requestProperties.body.email
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length >= 6
            ? requestProperties.body.password
            : false;

    const isAgree =
        (typeof requestProperties.body.isAgree === 'boolean' && requestProperties.body.isAgree) ||
        false;

    if (firstName && lastName && email && phone && password && isAgree) {
        // make sure that the user doesn't already exits
        data.read('users', phone, (err, response) => {
            if (err) {
                const user = {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: hash(password),
                    isAgree,
                };

                // store data to database
                data.create('users', phone, user, (createFileErr) => {
                    if (!createFileErr) {
                        callback(200, {
                            message: 'Everything is perfect',
                        });
                    } else {
                        callback(404, {
                            error: 'User Not Found!!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side.',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a Problem in Your Request',
        });
    }
};

handlers._users.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        const id =
            typeof requestProperties.headersObject.token === 'string' &&
            requestProperties.headersObject.token.trim().length === 20
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._tokens.verify(id, phone, (tokenVerifyResponse) => {
            if (tokenVerifyResponse) {
                // read data based on phone number
                data.read('users', phone, (err, userResponse) => {
                    const user = { ...parseJSON(userResponse) };
                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            message: 'Unable to find your data',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'User Authentication Failed!!',
                });
            }
        });
    } else {
        callback(404, {
            message: 'There was no such data matched with your phone number',
        });
    }
};

handlers._users.put = (requestProperties, callback) => {
    // first of all I have to check all informations are valid or invalid
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length
            ? requestProperties.body.lastName
            : false;

    const email =
        typeof requestProperties.body.email === 'string' &&
        requestProperties.body.email.trim().length
            ? requestProperties.body.email
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.length === 11
            ? requestProperties.body.phone
            : false;

    // second of all I have to check, user given phone number or not
    if (phone) {
        const id =
            typeof requestProperties.headersObject.token === 'string' &&
            requestProperties.headersObject.token.trim().length === 20
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._tokens.verify(id, phone, (tokenVerifyResponse) => {
            if (tokenVerifyResponse) {
                // third of all I have to check, user data are exists in my database or not
                data.read('users', phone, (err, responseData) => {
                    // if err has occured, go ahead
                    if (!err) {
                        // parse json data to javascript object
                        const userData = { ...parseJSON(responseData) };

                        // check individual property
                        if (firstName) userData.firstName = firstName;

                        if (lastName) userData.lastName = lastName;

                        if (email) userData.email = email;

                        // finally updating file
                        data.update('users', phone, userData, (updateErr) => {
                            if (!updateErr) {
                                callback(200, {
                                    message: 'Your data updated successfully!!',
                                });
                            } else {
                                callback(500, {
                                    error: 'There is a problem in server side',
                                });

                                console.log(updateErr);
                            }
                        });
                    } else {
                        callback(404, {
                            error: 'User Not Found in Database. Please Create a user and then try to update',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: "User Unauthenticated, Can't Update Anything!!",
                });
            }
        });
    } else {
        callback(500, {
            error: "You're not provided phone number yet. phone number is required",
        });
    }
};

handlers._users.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.length === 11
            ? requestProperties.body.phone
            : false;

    if (phone) {
        const id =
            typeof requestProperties.headersObject.token === 'string' &&
            requestProperties.headersObject.token.trim().length === 20
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._tokens.verify(id, phone, (tokenVerifyResponse) => {
            if (tokenVerifyResponse) {
                // if phone exists, delete the file
                data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User deleted successfully!!',
                        });
                    } else {
                        callback(404, {
                            error: 'User Not Found!!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: "User Unauthenticated, Can't Delete Anything!!",
                });
            }
        });
    }
};

module.exports = handlers;
