const config = {
    production:{
        port: process.env.PORT,
        dbIp: process.env.dbIp,
    },
    development:{
        port: 4021,
        dbIp: '127.0.0.1',
    },
    mail:{
        address: 'XXXX',
        pass: 'XXX',
    },
    jwt:{
        key: 'twitter2key',
    },
}

module.exports = config