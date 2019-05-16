const mongoose = require('mongoose')
const SMS = require('./model/sms')
const _ = require('lodash')

var model = null
var xlsx = './sms_log.xlsx'

// mongoxlsx.xlsx2MongoData(xlsx, model, function (err, data) {
//   console.log(data);
// });
const viettel = ['8496', '8497', '8498', '8486', '8432', '8433', '8434', '8435', '8436', '8437', '8437', '8439']
const vinaphone = ['8488', '8491', '8494', '8481', '8482', '8483', '8484', '8485']
const mobiphone = ['8490', '8493', '8470', '8479', '8477', '8476', '8478', '8489']

module.exports = (app, mongoXlsx) => {
  app.get('/', (req, res) => {
    mongoXlsx.xlsx2MongoData(xlsx, model, async function (err, data) {
      await _.forEach(data, (item) => {
        let newSMS = new SMS()
        newSMS.id = item.id
        newSMS.phonenumber = item.DTDD.toString()
        newSMS.content = item.NOIDUNG
        newSMS.sentAt = new Date(Math.round((item.THOIGIANGUI - 25569) * 86400 * 1000))
        newSMS.sms = Math.round(item.NOIDUNG.length / 60)
        _.forEach(viettel, (vItem) => {
          if (item.DTDD.toString().match(vItem)) {
            newSMS.telco = 'viettel'
          }
        })
        _.forEach(vinaphone, (vnItem) => {
          if (item.DTDD.toString().match(vnItem)) {
            newSMS.telco = 'vinaphone'
          }
        })
        _.forEach(mobiphone, (mItem) => {
          if (item.DTDD.toString().match(mItem)) {
            newSMS.telco = 'mobiphone'
          }
        })
        newSMS.save(function (err) {
          if (err)
            throw err
        })
      })
    })
    res.send({
      message: 'ok'
    })
  })

  app.post('/sms', function (req, res, next) {
    if (!req.body) {
      return res.status(400).send({
        message: "be empty"
      })
    }
    let newSMS = new SMS()
    newSMS.id = req.body.id
    newSMS.phonenumber = req.body.phonenumber
    newSMS.content = req.body.content
    newSMS.sentAt = req.body.sentAt
    newSMS.telco = req.body.telco
    newSMS.sms = req.body.sms
    newSMS.save(function (err, data) {
      if (err)
        throw err
      res.send(data)
    })

  })
  app.get('/sms', (req, res) => {
    console.log(req)
    let phone = req.params.phone
    let telco = req.params.telco
    if (telco === "" && phone === "") {
      SMS.find().then(messages => {
        res.send(messages)
      })
    }
    SMS.findOne({ phonenumber: phone, telco: telco })
      .then(messages => {
        res.send(messages)
      })
      .catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            message: "Note not found"
          })
        }
      })
  })
}