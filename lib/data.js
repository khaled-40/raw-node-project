/**
 * Title: CRUD Operations
 * Description: Create, Read, Update, Delete Data in the file system
 * Author: MD Khaled Masud Hamim
 * Date: 04/03/2026
 */

// dependencies
const { error } = require('console');
const fs = require('fs');
const path = require('path')

// module scaffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string because data might be javascript raw object
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false)
                        } else {
                            callback('Error closing new file!')
                        }
                    })
                } else {
                    callback('Error writing to new file!')
                }
            })
        } else {
            callback(err)
        }
    })
}

// read data from specific file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data)
    })
}

// update data from the file
lib.update = (dir, file, data, callback) => {
    // file open for updating
    fs.open(lib.basedir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate(empty) the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    // write to the file
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if (!err2) {
                            // close the file
                            fs.close(fileDescriptor, (err3) => {
                                if (!err3) {
                                    callback(false)
                                } else {
                                    callback('Error closing file')
                                }
                            })
                        } else {
                            callback('Error writing to file!')
                        }
                    })
                } else {
                    callback('Error truncating file')
                }
            })
        } else {
            callback(err)
        }
    })
}

// delete existing file
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false)
        } else {
            callback('Error unlinking file!')
        }
    })
}

// export the module
module.exports = lib;