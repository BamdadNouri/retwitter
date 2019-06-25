const bcrypt = require('bcrypt')
const validationService = require('../services/validate')
const userToken = require('../services/userToken')
const mailService = require('../services/mail')
const dm = require('../models/dataModel')


exports.register = async(req, res) => {
    try{
    const {error} = validationService('registerUser', req.body)
    if(error) return res.status(400).send(error.details[0].message)

    var checkUser = await dm.checkUserExistance(req.body.id)
    if(checkUser) return res.status(409).send('This id is taken!')

    const salt = await bcrypt.genSalt(10)
    var hashedPass = await bcrypt.hash(req.body.password, salt)

    var t = await dm.addUserToDB({id: req.body.id,
                                username: req.body.username,
                                hashedPassword: hashedPass,
                                email: req.body.email,
                                bio: 'Some placeholder bio.'})
    .catch((err) => {return res.status(400).send(err)})

    //mailService('userWelcome', {email: req.body.email})
        
    const token = userToken.generateAuthToken(req.body.id)
        
    res.status(200).send(token)                     

    }catch(err){
        res.status(500).send(err)
    }
}


exports.login = async (req, res) => {
    try{

    const {error} = validationService('loginUser', req.body)
    if(error) return res.status(400).send(error.details[0].message)

    var checkUser = await dm.checkUserExistance(req.body.id)
    if(!checkUser) return res.status(404).send('No user found with this id!')

    const validatePassword = await bcrypt.compare(req.body.password, checkUser.rows[0].password)
    if(!validatePassword) return res.status(400).send('Invalid password!')

    var token = userToken.generateAuthToken(req.body.id)

    res.status(200).send(token)

    }catch(err){
       res.status(500).send(err)
    }
}


exports.follow = async(req, res) => {
    try{

    var checkUser = await dm.checkUserExistance(req.params.userId)
    if(!checkUser) return res.status(404).send('UserNout found!')

    dm.handleFollowing(req.params.userId, req.user.id, '+')
    .catch((error) => {return res.status(400).send('ERROR ' + error)})

    dm.handleFollower(req.params.userId, req.user.id, '+')
    .catch((error) => {return res.status(400).send('ERROR ' + error)})

    res.status(200).send('Followed :)')

    }catch(err){
        res.status(500).send(err)
    }
}


exports.unfollow = async(req, res) => {
    try{

    var checkUser = await dm.checkUserExistance(req.params.userId)
    if(!checkUser) return res.status(404).send('User not found!')

    if(checkUser.rows[0].followers == null || !checkUser.rows[0].followers.includes(req.user.id)){
        return res.status(400).send("You're not following this user!")
    }

    dm.handleFollowing(req.params.userId, req.user.id, '-')
    .catch((error) => {return res.status(400).send('ERROR ' + error)})

    dm.handleFollower(req.params.userId, req.user.id, '-')
    .catch((error) => {return res.status(400).send('ERROR ' + error)})

    res.status(200).send('Unfollowed!')

    }catch(err){
        res.status(500).send(err)
    }
}






const cassandra = require('cassandra-driver')

var db = {
    contactPoints: ['127.0.0.1'],
    keyspace: 'retwitter',
    localDataCenter: 'datacenter1'
}
var connection = new cassandra.Client(db)
connection.connect(function(err, result){
    if(err){
        console.log(`ERROR connecting to cassandra. \n${err}`)
    }else{
        console.log('FINE but not necessary.')
    }
})

exports.all = async(req, res) => {
    try{

    var select = 'SELECT * from users'
    connection.execute(select, (err, rows) => {
        res.json(rows.rows)
        })

    }
    catch(err){
        res.status(500).send(err)
    }
}

