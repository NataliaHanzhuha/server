const express = require('express')
const app = express()
const paths = require('./router/paths')
const cors = require('cors')({ origin: true })
var bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use('/', paths)
app.listen(8081)

console.log('server started on 8081 port')