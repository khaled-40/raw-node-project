/**
 * Title: Project Initial File
 * Description: Initial file to start the node servers and workers
 * Author: MD Khaled Masud Hamim
 * Date: 01/03/2026
 */

// dependencies
const server = require("./lib/server");
const worker = require("./lib/worker");


// app object - module scaffolding
const app = {};

// testing file system
// TODO remove it later
// sendTwilioSms('01404299196', 'Hello World', (err) => {
//     console.log(`this is the error ${err}`)
// })

app.init = () => {
    // start the server
    server.init();
    // start the workers
    worker.init();
}

app.init();

// export the app
module.exports = app;