const express = require('express')
const app = express.Router()
const orderFunc = require('../controllers/Order')

app.post('/order', orderFunc.lisOrders)
app.post('/order/view', orderFunc.viewOrder)

module.exports = app
