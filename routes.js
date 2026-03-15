/**
 * Title: Routes
 * Description: Application Routes
 * Author: MD Khaled Masud Hamim
 * Date: 03/03/2026
 */

// dependencies
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");
const { sampleHandler } = require("./handlers/routeHandlers/smapleHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler
}

module.exports = routes;