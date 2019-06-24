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
        address: 'bmddtest@gmail.com',
        pass: 'dbdmrs77',
    },
    jwt:{
        key: 'twitter2key',
    },
}

module.exports = config