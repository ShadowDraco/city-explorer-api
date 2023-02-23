const express = require('express')
const app = express()
// make dotenv work
require('dotenv').config()
const port = process.env.PORT // get port from .env

// require cors to manage requests between two servers
const cors = require('cors')

const corsOptions = {
	origin: '*',

	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
}
// use cors when making requests
app.use(cors(corsOptions))
// include express.json which allows express to recognize and use JSON in requests
app.use(express.json())
// lets you use requests and responses that are url encoded. does what express.json does but for urlencoded things
//app.use(express.urlencoded({ extended: false }))

// get requests from the 'root route'
app.get('/', (req, res) => {
	console.log('home route accessed')
	res.send('Welcome') // send information back to the client
})

// include the route for weather
const weatherRoute = require('./routes/weather')
app.use('/weather', weatherRoute) // use the route on incoming requests

const movieRoute = require('./routes/movies')
app.use('/movies', movieRoute)

app.get('/healthy', (req, res) => {
	console.log('health route accessed')
	res.status(200).send('healthy')
})

// listen for requests
app.listen(port, (req, res) => {
	console.log(`Running on port: ${port}`)
	console.log(process.env.TEST_VAR)
})
