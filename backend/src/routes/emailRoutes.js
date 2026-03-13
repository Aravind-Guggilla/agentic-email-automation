const express = require('express')

const router = express.Router()

const emailController = require('../controllers/emailController')

router.get('/emails', emailController.getEmails)

router.get('/emails/search', emailController.searchEmails)

router.get('/emails/account/:account', emailController.getEmailsByAccount)

router.get('/suggest-reply/:emailId', emailController.suggestReply)


module.exports = router