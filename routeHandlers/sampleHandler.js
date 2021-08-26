/*
 * Title: handlers module
 * Description: Creating necessary handlers
 * Author: A B M Zubayer
 * Date: 14/08/21
 *
 */

// module scaffolding
const handlers = {};

// sampleHandler
handlers.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is sample Route',
        path: requestProperties.trimmedPath,
    });
};

module.exports = handlers;
