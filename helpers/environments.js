// module sacffolding
const environments = {};

environments.staging = {
    port: 3030,
    secretKey: 'hasdjnksandkjasn',
};

environments.production = {
    port: 4040,
    secretKey: 'hasdjnksandkjasn',
};

// check ENV exists or not
const currentEnvironments =
    typeof process.env.ENV === 'string' ? process.env.ENV : environments.staging;

//  check corresponding matches
const environmentsToExport =
    typeof environments[currentEnvironments] === 'object'
        ? environments[currentEnvironments]
        : environments.staging;

//   module exports
module.exports = environmentsToExport;
