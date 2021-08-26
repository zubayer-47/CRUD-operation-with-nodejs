/*
 * Title: Utility methods
 * Description: All necessary utility methods
 * Author: A B M Zubayer
 * Date: 16/08/21
 *
 */

// module scaffolding
const crypto = require('crypto');
const environments = require('./environments');

const utilities = {};
// method for parsing json data to javascript object with error handling
utilities.parseJSON = (jsonObject) => {
    let output;

    try {
        output = JSON.parse(jsonObject);
    } catch {
        output = {};
    }

    return output;
};

// method for hashing user password
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// method for create random string
utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        let str = '';
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacters = possibleCharacters.charAt(
                Math.floor(Math.random() * strLength)
            );

            str += randomCharacters;
        }
        return str;
    }
    return false;
};

module.exports = utilities;
