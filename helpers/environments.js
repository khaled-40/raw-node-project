/**
 * Title: Environments
 * Description: Handle Environment Set Up
 * Author: MD Khaled Masud Hamim
 * Date: 03/03/2026
 */

// dependencies


// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging'
}

environments.production = {
    port: 5000,
    envName: 'production'
}

// determine which environment is passed
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.trim() : 'staging';

// export corresponding environment object
const environmentToExport = typeof (environments[currentEnvironment]) === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

    // export the module
    module.exports = environmentToExport;