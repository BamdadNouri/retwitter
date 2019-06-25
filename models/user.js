const mongoose = require('mongoose')
const connection = require('../drivers/cassandra')


class UserData{



async checkUserExistance(userId){

    var select = 'SELECT * from users WHERE id=?;'
    var check = await connection.execute(select, [userId])
    if(check.rows.length != 0){
        return check
    }else{
        return false
    }
}

async addUserToDB(user){

    var insert = 'INSERT INTO users(id,username,password,email,bio,followers,followings) VALUES (?,?,?,?,?,?,?);'
    return await connection.execute(insert, [user.id, user.username, user.hashedPassword, user.email, user.bio, [], []])

}

async handleFollowing(userId, id, action){

    var update = `UPDATE users SET followings = followings ${action} {'${userId}'} WHERE id=?;`
    return await connection.execute(update, [id])

}

async handleFollower(userId, id, action){

    var update = `UPDATE users SET followers = followers ${action} {'${id}'} WHERE id=?`
    return await connection.execute(update, [userId])

}

async newTweet(tweet){

    var insert = 'INSERT INTO tweets(id,userId,body,tstamp,likes,pointTo) VALUES (?,?,?,?,?,?);'
    return await connection.execute(insert, [tweet.tId, tweet.userId, tweet.body, tweet.timestamp, [], tweet.pointTo])

}

 async hashtagHandler(tag, tweetId){

    var insert = 'INSERT INTO hashtags(tagId,tagName,tweetId) VALUES (?,?,?)'
    var tagId = (mongoose.Types.ObjectId()).toString()
    return await connection.execute(insert, [tagId ,tag, tweetId])
}

async checkUserAccess(tweetId, id){

    var select = 'SELECT * from tweets WHERE userId=? AND id=?;';
    var access = await connection.execute(select, [id, tweetId])
    if(access.rows.length == 0){
        return false
    }else{
        return access
    }
}
}

module.exports = new UserData()