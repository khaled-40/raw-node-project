/**
 * Title: Routes
 * Description: Application Routes
 * Author: MD Khaled Masud Hamim
 * Date: 03/03/2026
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/smapleHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler
}

module.exports = routes;