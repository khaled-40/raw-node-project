/**
 * Title: Notification Library
 * Description: Important functions to notify users
 * Author: MD Khaled Masud Hamim
 * Date: 27/03/2026
 */

// dependencies
const https = require('https');
const queryString = require('querystring')
const { twilio } = require('./environments');
const { parseJSON } = require('./utilities');


// module scaffolding
const notifications = {};

// send sms to the user using twilio API
notifications.sendTwilioSms = (phone, msg, callback) => {
    // input validation
    const userPhone = typeof (phone) === 'string'
        && phone.trim().length === 11
        ? phone.trim()
        : false;

    const userMsg = typeof (msg) === 'string'
        && msg.trim().length > 0
        && msg.trim().length <= 1600
        ? msg.trim()
        : false;

    if (userPhone && userMsg) {
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg
        }

        // stringify the payload
        const stringigyPayload = queryString.stringify(payload);

        // configure the https request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        };

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            const status = res.statusCode;

            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                const parsed = parseJSON(body);

                if (status === 200 || status === 201) {
                    callback(false);
                } else {
                    callback(`Status ${status}: ${JSON.stringify(parsed)}`);
                }
            });
        });

        req.on('error', (e) => {
            callback(e);
        })
        req.write(stringigyPayload);
        req.end();
    } else {
        callback('Given parameters were missing or invalid!')
    }
}

// export the module 
module.exports = notifications;