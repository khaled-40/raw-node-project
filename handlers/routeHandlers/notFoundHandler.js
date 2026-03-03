/**
 * Title: 404 Not Found Handler
 * Description: 404 Not Found Handler
 * Author: MD Khaled Masud Hamim
 * Date: 03/03/2026
 */

// module scafforlding
const handler = {};

handler.notFoundHandler =(requestProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found'
    })
};

module.exports = handler;