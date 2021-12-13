const express = require('express')
const app = express.Router()
const authFunc = require('../controllers/Auth')

app.post('/confirm', authFunc.validateTokens)

module.exports = app
