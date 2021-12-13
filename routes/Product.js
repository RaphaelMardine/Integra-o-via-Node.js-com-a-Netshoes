const express = require('express')
const app = express.Router()
var productFunc = require('../controllers/Product')

app.post('/product', productFunc.listProducts)
app.post('/product/view', productFunc.listProducts)
app.post('/product/total', productFunc.totalProduct)
app.post('/product/save', productFunc.saveProduct)

module.exports = app
