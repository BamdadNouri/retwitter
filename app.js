const express = require('express')
const cassandra = require('cassandra-driver')

const config = require('./config/config')
const user = require('./routes/user')
const tweet = require('./routes/tweet')
const app = express()
app.use(express.json())

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


app.use('/user', user)
app.use('/tweet', tweet)

app.listen(config.development.port, () => console.log(`App running on port ${config.development.port}.`))

