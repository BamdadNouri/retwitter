const config = require('../config/config')
const jwt = require('jsonwebtoken')

const tokenTime = 60*60*24*3*12

exports.generateAuthToken = (userID) => {

    const token = jwt.sign({id: userID}, config.jwt.key, { expiresIn: tokenTime})
    return token
}