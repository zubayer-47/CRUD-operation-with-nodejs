/*
 * Title: Not Found Handler
 * Description: 404 Not Found Handler
 * Author: A B M Zubayer
 * Date: 14/08/21
 *
 */

// module scaffolding
const handlers = {};

// notFoundHandler
handlers.notFoundHandler = ({ trimmedPath }, callback) => {
    callback(404, {
        message: 'Not Found!',
        path: trimmedPath,
    });
};

module.exports = handlers;
