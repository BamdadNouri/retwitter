const mongoose = require('mongoose')
const connection = require('../drivers/cassandra')


class TweetData{



async removeTweet(tweetId, id){

    var remove = 'DELETE FROM tweets WHERE id=? AND userId=?;'
    return await connection.execute(remove, [tweetId, id])
}

async handleLikes(tweetId, userId, id, action){

    var update = `UPDATE tweets SET likes = likes ${action} {'${id}'} WHERE id=? AND userId=?;`
    return await connection.execute(update, [tweetId, userId])
}

async queryFollowings(id){

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

async createTimeline(followings){

    var select = `SELECT * from tweets WHERE userId IN ${followings}`
    return await connection.execute(select)
}
}

module.exports = new TweetData()