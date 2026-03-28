/**
 * Title: Server Library
 * Description: Server related files
 * Author: MD Khaled Masud Hamim
 * Date: 28/03/2026
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');



// app object - module scaffolding
const server = {};



// create server 
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`)
    })
}

// handle Request Response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
    server.createServer();
}

// export the module
module.exports = server;