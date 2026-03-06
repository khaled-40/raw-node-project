/**
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: MD Khaled Masud Hamim
 * Date: 03/03/2026
 */

// module scafforlding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a sample URL'
    })
};

module.exports = handler;