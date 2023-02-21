const express = require('express')
const app = express()
const port = 8000

// make dotenv work
require('dotenv').config()

app.get('/', (req, res) => {
	console.log('home route accessed')
	res.send('Welcome')
})

app.listen(port, (req, res) => {
	console.log(`Running on port: ${port}`)
	console.log(process.env.TEST_VAR)
})
