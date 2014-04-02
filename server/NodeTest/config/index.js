var config = {
    local: {
        mode: 'local',
        port: 3000
    },
    staging: {
        mode: 'staging',
        port: 4000
    },
}
module.exports = function() {
    return config;
    //return config[mode || process.argv[2] || 'local'] || config.local;
}