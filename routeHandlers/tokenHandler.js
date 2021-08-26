/*
 * Title: Token Handler
 * Description: Handler for handle Tokens
 * Author: A B M Zubayer
 * Date: 14/08/21
 *
 */

// module scaffolding
const handlers = {};
const { hash, parseJSON, createRandomString } = require('../helpers/utilities');
const data = require('../lib/data');

// sampleHandler
handlers.tokenHandler = (requestProperties, callback) => {
    const requestMethod = ['get', 'post', 'put', 'delete'];

    if (requestMethod.indexOf(requestProperties.method) > -1) {
        handlers._tokens[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Not found',
            method: requestProperties.method,
        });
    }
};

handlers._tokens = {};

handlers._tokens.post = (requestProperties, callback) => {
    // check user provided phone and password
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

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            const user = { ...parseJSON(userData) };
            const hashedPassword = hash(password);

            if (!err) {
                if (hashedPassword === user.password) {
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000;

                    const tokenObject = {
                        phone,
                        id: tokenId,
                        expires,
                    };

                    data.create('tokens', tokenId, tokenObject, (createErr) => {
                        if (!createErr) {
                            callback(200, {
                                message: 'Token created successfully!!',
                            });
                        } else {
                            callback(500, {
                                error: false,
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'Password Not Valid!',
                    });
                }
            } else {
                callback(500, {
                    error: 'There is a problem in server side!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Password and phone number Not Valid!',
        });
    }
};

handlers._tokens.get = (requestProperties, callback) => {
    // check token are valid or invalid
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err) {
                const token = { ...parseJSON(tokenData) };
                if (token.id === id) {
                    callback(200, token);
                } else {
                    callback(404, {
                        error: 'Token Not Found!!',
                    });
                }
            } else {
                callback(400, {
                    error: 'Unable to fetch data from database',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Token is Not Valid!!',
        });
    }
};

handlers._tokens.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;

    const expire = !!(
        typeof requestProperties.body.expire === 'boolean' && requestProperties.body.expire === true
    );

    if (id && expire) {
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };

            if (!err) {
                if (token.expires > Date.now()) {
                    token.expires = Date.now() + 60 * 60 * 1000;

                    data.update('tokens', id, token, (updateErr) => {
                        if (!updateErr) {
                            callback(200, {
                                message: 'Token Updated Successfully!!',
                            });
                        } else {
                            callback(500, {
                                error: 'There was a problem in server side!!!',
                            });
                        }
                    });
                } else {
                    callback(404, {
                        error: 'Token Id Not Valid!!',
                    });
                }
            } else {
                callback(404, {
                    error: 'Token Not Found!!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There is a problem in your request!!',
        });
    }
};

handlers._tokens.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (deleteErr) => {
                    if (!deleteErr) {
                        callback(200, {
                            message: 'User Token Deleted Successfully!!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a problem in server side!!',
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'Token Not Valid!!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'There is a problem in your request!!',
        });
    }
};

handlers._tokens.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err) {
            const token = { ...parseJSON(tokenData) };
            if (token.phone === phone && token.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handlers;
