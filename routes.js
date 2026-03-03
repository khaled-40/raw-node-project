/**
 * Title: Routes
 * Description: Application Routes
 * Author: MD Khaled Masud Hamim
 * Date: 03/03/2026
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/smapleHandler")

const routes = {
    sample : sampleHandler,
}

module.exports = routes;