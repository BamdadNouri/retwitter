const cassandra = require('cassandra-driver')
const validationService = require('../services/validate')

const mongoose = require('mongoose')

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
        console.log('Cassandra tweets connection works fine.')
    }
})


exports.new = (req, res) => {
    try{

    const {error} = validationService('newTweet', req.body)
    if(error) return res.status(400).send(error.details[0].message)

    var insert = 'INSERT INTO tweets(id,userId,body,tstamp,likes,pointTo) VALUES (?,?,?,?,?,?);'
    const timeStamp = new Date().toISOString()
    var tId = (mongoose.Types.ObjectId()).toString()
    connection.execute(insert, [tId, req.user.id, req.body.body, timeStamp, [], 'none'], (err) => {

        if(err){
            return res.status(400).send(`Error! \n${err}`)
        }
        handleHashtag(req.body.body, tId)

        res.send('New tweet added.')
    })

    }catch(err){
        res.status(500).send(err)
    }
}


exports.reply = (req, res) => {
    try{

    const {error} = validationService('replyTweet', req.body)
    if(error) return res.status(409).send(error.details[0].message)

    var insert = 'INSERT INTO tweets(id,userId,body,tstamp,likes,pointTo) VALUES (?,?,?,?,?,?);'
    const timeStamp = new Date().toISOString()
    var tId = (mongoose.Types.ObjectId()).toString()
    connection.execute(insert, [tId, req.user.id, req.body.body, timeStamp, [], req.params.pointTo], (err) => {

        if(err){
            return res.status(400).send(`Error! \n${err}`)
        }
        handleHashtag(req.body.body, tId)
        res.send('Reply tweet added.')
    })

    }catch(err){
        res.status(500).send(err)
    }    
}


exports.delete = (req, res) => {
    try{

    var select = 'SELECT * from tweets WHERE userId=? AND id=?;';
    connection.execute(select, [req.user.id, req.params.tweetId], (err, rows) => {
        
        if(err){
            return res.status(400).send(err)
        }
        if(rows.rows.length != 0){
            var remove = 'DELETE FROM tweets WHERE id=? AND userId=?;'
            connection.execute(remove, [req.params.tweetId, req.user.id], (err) => {
                if(err){
                    return res.status(400).send(err)
                }
                return res.status(200).send('Tweet deleted!')
            })
        }else{
            return res.status(401).send('Unauthorized!')
        }
    })

    }catch(err){
        res.status(500).send(err)
    }
}


exports.like = (req, res) => {
    try{

    var select = 'SELECT * from tweets WHERE id=? AND userId=?;'
    connection.execute(select, [req.params.tweetId, req.params.userId], (selectError, selectRows) => {
        if(selectRows.rows.length !=0){
            var update = `UPDATE tweets SET likes = likes + {'${req.user.id}'} where id=? AND userId=?;`
            connection.execute(update, [req.params.tweetId, req.params.userId], (err, rows) => {
                if(!err){
                    return res.status(200).send('Liked!')
                }else{
                    return res.status(400).send(err)
                }
            })
        }else{
            return res.status(404).send('Invalid tweet!')
        }
    })

    }catch(err){
        res.status(500).send(err)
    }
}


exports.unlike = (req, res) => {
    try{

    var select = 'SELECT * from tweets WHERE id=? AND userId=?;'
    connection.execute(select, [req.params.tweetId, req.params.userId], (selectError, selectRows) => {
        if(selectRows.rows.length !=0){

            if(selectRows.rows[0].likes == null || !selectRows.rows[0].likes.includes(req.user.id)){
                return res.status(400).send("You even didn't like the tweet man :/")
            }

            var update = `UPDATE tweets SET likes = likes - {'${req.user.id}'} where id=? AND userId=?;`
            connection.execute(update, [req.params.tweetId, req.params.userId], (err, rows) => {
                if(!err){
                    return res.status(200).send('Unliked!')
                }else{
                    return res.status(400).send(err)
                }
            })
        }else{
            return res.status(404).send('Invalid tweet!')
        }
    })

    }catch(err){
        res.status(500).send(err)
    }
}


exports.retweet = (req, res) => {
    try{

    var select = 'SELECT * from tweets WHERE id=? AND userId=?;'
    connection.execute(select, [req.params.tweetId, req.params.userId], (err, row) => {

        var insert = 'INSERT INTO tweets(id,userId,body,tstamp,likes,pointTo) VALUES (?,?,?,?,?,?);'
        const timeStamp = new Date().toISOString()
        var tId = (mongoose.Types.ObjectId()).toString()
        connection.execute(insert, [tId, req.user.id, row.rows[0].body, timeStamp, [], 'none'], (err) => {
    
            if(err){
                return res.status(400).send(`Error! \n${err}`)
            }
            handleHashtag(req.body.body, tId)
    
            res.send('New tweet added.')
        })
    })
    
    

    }catch(err){
        res.status(500).send(err)
    }
}


exports.timeline = (req, res) => {
    try{

    var query = 'SELECT * from users WHERE id=?;'
    connection.execute(query, [req.user.id], (err, rows) => {

        var q = "("
        for(var i=0;i<rows.rows[0].followings.length;i++){

            q += "'" + rows.rows[0].followings[i].toString() + "'"

            if(i != rows.rows[0].followings.length-1){
                q += ', '
            }
        }
        q += ")"
        var select = `SELECT * from tweets WHERE userId IN ${q}`
        connection.execute(select, (err, selectRows) => {
            if(!err){

                return res.status(200).send(selectRows.rows.sort((x, y) => {
                    //return x.tstamp - y.tstamp
                    if(x.tstamp > y.tstamp) return -1
                    if(x.tstamp < y.tstamp) return 1
                    return 0
                }))
            }else{
                return res.status(400).send(err)
            }
        })
        
    })
    }catch(err){
        res.status(500).send(err)
    }
}




exports.getTweets = async(req, res) => {

    var select = 'SELECT * from tweets;'
    var rows = await connection.execute(select)
    console.log(rows.rows.length)
        res.json(rows.rows)
}

exports.getTags = (req, res) => {
//flake()
    var select = 'SELECT * from hashtags'
    connection.execute(select, (err, rows) => {
        res.json(rows.rows)
    })
}


function handleHashtag(body, tweetId){
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm
    var matches = [],
        match = ''

    while((match = regex.exec(body))){
        matches.push(match[1])
    }
    matches.map((tagN) => {
        hashtagHandler(tagN, tweetId)
    })
}

function hashtagHandler(tag, tweetId){

    var insert = 'INSERT INTO hashtags(tagId,tagName,tweetId) VALUES (?,?,?)'
    var tagId = (mongoose.Types.ObjectId()).toString()
    connection.execute(insert, [tagId ,tag, tweetId], (err) => {
        if(err){
            //handle error
        }
        //handle success
    })
}

function flake(){
var epoch = 1561388282
//  1546300800
var current = Math.floor(new Date().getTime()/1000.0)


var id = ((current - epoch) << 22) | Math.floor((Math.random()*4194303))

console.log(id)
} 
