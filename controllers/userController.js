const bcrypt = require('bcrypt')
const validationService = require('../services/validate')
const userToken = require('../services/userToken')
const mailService = require('../services/mail')

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
        console.log('Cassandra users connection works fine.')
    }
})

exports.register = (req, res) => {
    try{
    const {error} = validationService('registerUser', req.body)
    if(error) return res.status(400).send(error.details[0].message)



    var select = 'SELECT * from users WHERE id= ?;'
    
    connection.execute(select, [req.body.id], async(err, rows) => {

        if(rows.rows.length == 0){

            const salt = await bcrypt.genSalt(10)
            var insert = 'INSERT INTO users(id,username,password,email,bio,followers,followings) VALUES (?,?,?,?,?,?,?);'

            var hashedPass = await bcrypt.hash(req.body.password, salt)

            connection.execute(insert, [req.body.id, req.body.username, hashedPass, req.body.email, 'some placeholder bio :)', [], []], (err) => {
                if(err){
                    res.status(400).send('Error!')
                }
            })
        
            //mailService('userWelcome', {email: req.body.email})
        
            const token = userToken.generateAuthToken(req.body.id)
        
            res.status(200).send(token)

        }else{
            return res.status(409).send('This id is taken!')
        }
    })

    }catch(err){
        res.status(500).send(err)
    }
}


exports.login = (req, res) => {
    try{

    const {error} = validationService('loginUser', req.body)
    if(error) return res.status(400).send(error.details[0].message)

    var selectUser = 'SELECT * from users WHERE id=?;'
    connection.execute(selectUser, [req.body.id], async(err, rows) => {

        if(rows.rows.length != 0){

            const validatePassword = await bcrypt.compare(req.body.password, rows.rows[0].password)
            if(!validatePassword) return res.status(400).send('Invalid password!')

            var token = userToken.generateAuthToken(req.body.id)

            res.status(200).send(token)
        }else{
            return res.status(404).send('No user found with this id!')
        }
    })

}catch(err){
        res.status(500).send(err)
    }
}


exports.follow = (req, res) => {
    try{

    var select = 'SELECT * from users WHERE id=?;'
    connection.execute(select, [req.params.userId], (err, selectRows) => {
        if(selectRows.rows.length != 0){

            var update = `UPDATE users SET followings = followings + {'${req.params.userId}'} WHERE id=?`
            connection.execute(update, [req.user.id], (err) => {
                if(err){
                    return res.status(400).send('ERROR ' + err)
                }
            })

            var updateUser = `UPDATE users SET followers = followers + {'${req.user.id}'} WHERE id=?`
            connection.execute(updateUser, [req.params.userId], (err) => {
                if(!err){
                    return res.status(200).send('Followed :)')
                }else{
                    return res.status(400).send('ERROR ' + err)
                }
            })
        }else{
            return res.status(404).send('User not found!')
        }
    })


    }catch(err){
        res.status(500).send(err)
    }
}


exports.unfollow = (req, res) => {
    try{

    var select = 'SELECT * from users WHERE id=?;'
    connection.execute(select, [req.params.userId], (err, selectRows) => {
        if(selectRows.rows.length != 0){

            if(selectRows.rows[0].followers == null || !selectRows.rows[0].followers.includes(req.user.id)){
                return res.status(400).send("You're not following this user!")
            }
            
            var update = `UPDATE users SET followings = followings - {'${req.params.userId}'} WHERE id=?`
            connection.execute(update, [req.user.id], (err) => {
                if(err){
                    return res.status(400).send('ERROR ' + err)
                }
            })

            var updateUser = `UPDATE users SET followers = followers - {'${req.user.id}'} WHERE id=?`
            connection.execute(updateUser, [req.params.userId], (err) => {
                if(!err){
                    return res.status(200).send('Unfollowed :)')
                }else{
                    return res.status(400).send('ERROR ' + err)
                }
            })
        }else{
            return res.status(404).send('User not found!')
        }
    })


    }catch(err){
        res.status(500).send(err)
    }
}


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
