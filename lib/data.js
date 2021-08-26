// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// base directory
lib.basedir = path.join(__dirname, '../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to JSON
            const string = JSON.stringify(data);

            // writing file
            fs.writeFile(fileDescriptor, string, (writeErr) => {
                if (!writeErr) {
                    // close file
                    fs.close(fileDescriptor, (closeErr) => {
                        if (!closeErr) {
                            callback(false);
                        } else {
                            callback('There is a problem in close file');
                        }
                    });
                } else {
                    callback('There is an Error on write file');
                }
            });
        } else {
            callback('There is an Error on opening file');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (readErr, data) => {
        callback(readErr, data);
    });
};

// update data to file
lib.update = (dir, file, data, callback) => {
    // open file
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err) {
            // convert data to json string
            const string = JSON.stringify(data);

            // truncate file to write data
            fs.ftruncate(fileDescriptor, (truncateErr) => {
                if (!truncateErr) {
                    // write data to file
                    fs.writeFile(fileDescriptor, string, (writeErr) => {
                        if (!writeErr) {
                            // close file
                            fs.close(fileDescriptor, (closeErr) => {
                                if (!closeErr) {
                                    callback(false);
                                } else {
                                    callback('There is an error occured on closing file');
                                }
                            });
                        } else {
                            callback('There is an error occured on writing file');
                        }
                    });
                } else {
                    callback('There is an error occured on truncate file');
                }
            });
        } else {
            callback('There is an error occured on opening file');
        }
    });
};

// delete file
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('There is an issue occured on deleting file');
        }
    });
};

// export module
module.exports = lib;
