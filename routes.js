/*
 * Title: Route module
 * Description: All Application routes are here
 * Author: A B M Zubayer
 * Date: 14/08/21
 *
 */

const { sampleHandler } = require('./routeHandlers/sampleHandler');
const { tokenHandler } = require('./routeHandlers/tokenHandler');
const { userHandler } = require('./routeHandlers/userHandler');

// dependencies

// module scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;
