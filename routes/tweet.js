const express = require('express')
const auth = require('../middlewares/auth')
const tweetController = require('../controllers/tweetController')

const router = express.Router()

router.post('/new', auth, tweetController.new)

router.post('/reply/:pointTo', auth, tweetController.reply)

router.delete('/delete/:tweetId', auth, tweetController.delete)

router.post('/like/:tweetId/:userId', auth, tweetController.like)

router.post('/unlike/:tweetId/:userId', auth, tweetController.unlike)

router.post('/retweet/:tweetId/:userId', auth, tweetController.retweet)

router.get('/timeline', auth, tweetController.timeline)


router.get('/all', tweetController.getTweets)
router.get('/tags',auth,  tweetController.getTags)

module.exports = router
