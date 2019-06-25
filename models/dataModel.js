const cassandra = require('cassandra-driver')
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
        console.log('Cassandra connection works fine.')
    }
})


exports.checkUserExistance = async (userId) => {

    var select = 'SELECT * from users WHERE id=?;'
    var check = await connection.execute(select, [userId])
    if(check.rows.length != 0){
        return check
    }else{
        return false
    }
}

exports.addUserToDB = async(user) => {

    var insert = 'INSERT INTO users(id,username,password,email,bio,followers,followings) VALUES (?,?,?,?,?,?,?);'
    return await connection.execute(insert, [user.id, user.username, user.hashedPassword, user.email, user.bio, [], []])

}

exports.handleFollowing = async(userId, id, action) => {

    var update = `UPDATE users SET followings = followings ${action} {'${userId}'} WHERE id=?;`
    return await connection.execute(update, [id])

}

exports.handleFollower = async(userId, id, action) => {

    var update = `UPDATE users SET followers = followers ${action} {'${id}'} WHERE id=?`
    return await connection.execute(update, [userId])

}

exports.newTweet = async(tweet) => {

    var insert = 'INSERT INTO tweets(id,userId,body,tstamp,likes,pointTo) VALUES (?,?,?,?,?,?);'
    return await connection.execute(insert, [tweet.tId, tweet.userId, tweet.body, tweet.timestamp, [], tweet.pointTo])

}

exports.hashtagHandler = async(tag, tweetId) => {

    var insert = 'INSERT INTO hashtags(tagId,tagName,tweetId) VALUES (?,?,?)'
    var tagId = (mongoose.Types.ObjectId()).toString()
    return await connection.execute(insert, [tagId ,tag, tweetId])
}

exports.checkUserAccess = async(tweetId, id) => {

    var select = 'SELECT * from tweets WHERE userId=? AND id=?;';
    var access = await connection.execute(select, [id, tweetId])
    if(access.rows.length == 0){
        return false
    }else{
        return access
    }
}

exports.removeTweet = async(tweetId, id) => {

    var remove = 'DELETE FROM tweets WHERE id=? AND userId=?;'
    return await connection.execute(remove, [tweetId, id])
}

exports.handleLikes = async(tweetId, userId, id, action) => {

    var update = `UPDATE tweets SET likes = likes ${action} {'${id}'} WHERE id=? AND userId=?;`
    return await connection.execute(update, [tweetId, userId])
}

exports.queryFollowings = async(id) => {

    var select = 'SELECT * from users WHERE id=?;'
    var query = await connection.execute(select, [id])
    var q = "("
    for(var i=0;i<query.rows[0].followings.length;i++){
        q += "'" + query.rows[0].followings[i].toString() + "'"

        if(i != query.rows[0].followings.length-1){
            q += ', '
        }
    }
    q += ")"

    return q
}

exports.createTimeline = async(followings) => {

    var select = `SELECT * from tweets WHERE userId IN ${followings}`
    return await connection.execute(select)
}