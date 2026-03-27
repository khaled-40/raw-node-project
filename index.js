/**
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: MD Khaled Masud Hamim
 * Date: 01/03/2026
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const lib = require('./lib/data');
const { sendTwilioSms } = require('./helpers/notifications');

// app object - module scaffolding
const app = {};

// testing file system
// TODO remove it later
sendTwilioSms('01404299196', 'Hello World', (err) => {
    console.log(`this is the error ${err}`)
})

// create server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`)
    })
}

// handle Request Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();