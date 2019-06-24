const express = require('express')
const auth = require('../middlewares/auth')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/register', userController.register)

router.post('/login', userController.login)

router.post('/follow/:userId', auth, userController.follow)

router.post('/unfollow/:userId', auth, userController.unfollow)

router.get('/all', userController.all)

module.exports = router

