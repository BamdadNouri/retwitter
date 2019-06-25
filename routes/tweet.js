const express = require('express')
const auth = require('../middlewares/auth')
const tweetController = require('../controllers/tweetController')

const router = express.Router()

router.post('/new/:pointTo?', auth, tweetController.newTweet)

router.delete('/delete/:tweetId', auth, tweetController.delete)

router.post('/like/:tweetId/:userId/:unlike?', auth, tweetController.like)

router.post('/retweet/:tweetId/:userId', auth, tweetController.retweet)

router.get('/timeline', auth, tweetController.timeline)



//router.get('/all', tweetController.getTweets)
//router.get('/tags',auth,  tweetController.getTags)

module.exports = router
