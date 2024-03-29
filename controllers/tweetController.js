
const validationService = require('../services/validate')
const userData = require('../models/user')
const tweetData = require('../models/tweet')
const utility = require('../services/utility')

const mongoose = require('mongoose')


class TweetController{


async newTweet(req, res){
    try{

    const {error} = validationService('newTweet', req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    var tId = (mongoose.Types.ObjectId()).toString()
    const timeStamp = new Date().toISOString()


    tweetData.newTweet({
        tId: tId,
        userId: req.user.id,
        body: req.body.body,
        timeStamp: timeStamp,
        pointTo: req.params.pointTo ? req.params.pointTo : 'none'
    })
    .catch((error) => {return res.status(400).send('ERROR ' + error)})

    utility.handlehashtag(req.body.body, tId)

    res.status(200).send('New tweet added :)')

    }catch(err){
        res.status(500).send(err)
    }
}


async delete (req, res){
    try{

    var checkAccess = await userData.checkUserAccess(req.params.tweetId, req.user.id)
    if(!checkAccess) return res.status(401).send('Unauthorized!')

    tweetData.removeTweet(req.params.tweetId, req.user.id)
    .catch((error) => {return res.status(400).sned('ERROR ' + error)})

    res.status(200).send('Tweet deleted!')

    }catch(err){
        res.status(500).send(err)
    }
}


async like (req, res){
    try{

    var checkTweet = await userData.checkUserAccess(req.params.tweetId, req.params.userId)
    if(!checkTweet) return res.status(404).send('Invalid tweet!')

    var action = req.params.unlike ? '-' : '+'

    tweetData.handleLikes(req.params.tweetId, req.params.userId, req.user.id, action)
    .catch((error) => {return res.status(400).send('ERROR '+ error)})

    res.status(200).send(req.params.unlike ? 'Unliked!' : 'Liked!')

    }catch(err){
        res.status(500).send(err)
    }
}


async retweet(req, res){
    try{

    var checkTweet = await userData.checkUserAccess(req.params.tweetId, req.params.userId)
    if(!checkTweet) return res.status(404).send('Invalid tweet!')

    const timeStamp = new Date().toISOString()
    var tId = (mongoose.Types.ObjectId()).toString()

    tweetData.newTweet({
        tId: tId,
        userId: req.user.id,
        body: checkTweet.rows[0].body,
        timeStamp: timeStamp,
        pointTo: 'none'
    })
    .catch((error) => {return res.status(400).send('ERROR ' + error)})

    utility.handlehashtag(checkTweet.rows[0].body, tId)

    res.status(200).send('retweeted.')

    }catch(err){
        res.status(500).send(err)
    }
}


async timeline (req, res){
    try{

    var followings = await tweetData.queryFollowings(req.user.id)

    var timeline = await tweetData.createTimeline(followings)

    res.status(200).send(timeline.rows.sort((a, b) => {
        if(a.tstamp > b.tstamp) return -1
        if(a.tstamp < b.tstamp) return 1
        return 0
    }))

    }catch(err){
        res.status(500).send(err)
    }
}
}

module.exports = new TweetController()




/*
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


exports.getTweets = async(req, res) => {

    var select = 'SELECT * from tweets;'
    var rows = await connection.execute(select)
    console.log(rows.rows.length)
        res.json(rows.rows)
}

exports.getTags = (req, res) => {

    var select = 'SELECT * from hashtags'
    connection.execute(select, (err, rows) => {
        res.json(rows.rows)
    })
}

*/