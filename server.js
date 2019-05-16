const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const mongoXlsx = require('mongo-xlsx')

const app = express()
mongoose.connect('mongodb://localhost:27017/sms_sending');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./app/routes.js')(app, mongoXlsx)


app.listen(8080)
