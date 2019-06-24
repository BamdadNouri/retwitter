const jwt = require('jsonwebtoken')
const config = require('../config/config')

function auth(req, res, next){

    const token = req.header('auth-token')
    if(!token) return res.status(401).send('Access dined. No token provided!')

    try{
        const decoded = jwt.verify(token, config.jwt.key)
        req.user = decoded
        next()

    }catch(ex){
        res.status(400).send('Invalid token!')
    }
}

module.exports = auth