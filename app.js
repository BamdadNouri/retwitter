const express = require('express')

const config = require('./config/config')
const user = require('./routes/user')
const tweet = require('./routes/tweet')
const app = express()
app.use(express.json())

app.use('/user', user)
app.use('/tweet', tweet)

app.listen(config.development.port, () => console.log(`App running on port ${config.development.port}.`))
