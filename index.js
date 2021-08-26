/*
 * Title: Uptime Monitoring Application
 * Description: A RestFul API to monitor up or down time of user defined links
 * Author: A B M Zubayer
 * Date: 14/08/2021
 *
 */

// dependencies
const http = require('http');
const environmentsToExport = require('./helpers/environments');
const { handleReqRes } = require('./helpers/handleReqRes');

// module scaffolding
const app = {};
// create server method
app.createServer = () => {
    // server with http module
    const server = http.createServer(app.handleReqRes);

    // listening server
    server.listen(environmentsToExport.port, () => {
        console.log(`Server is running on PORT ${environmentsToExport.port}`);
    });
};

// handle request and response method
app.handleReqRes = handleReqRes;

// method invocation
app.createServer();
