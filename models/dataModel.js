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
    var add = await connection.execute(insert, [user.id, user.username, user.hashedPassword, user.email, user.bio, [], []])
    return add
}

exports.handleFollowing = async(userId, id, action) => {

    var update = `UPDATE users SET followings = followings ${action} {'${userId}'} WHERE id=?;`
    var add = await connection.execute(update, [id])
    return add
}

exports.handleFollower = async(userId, id, action) => {

    var update = `UPDATE users SET followers = followers ${action} {'${id}'} WHERE id=?`
    var add = await connection.execute(update, [userId])
    return add
}
