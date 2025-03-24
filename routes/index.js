const express = require('express')
const router = express.Router()
const hbs = require('hbs')

router.get('/', function (req, res, next) {
  res.render('template', { name: 'Hello world!' })
})

router.get('/test', function (req, res, next) {
  res.render('test', { name: 'Test!' })
})

module.exports = router
