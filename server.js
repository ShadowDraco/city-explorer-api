const express = require('express')
const app = express()
// make dotenv work
require('dotenv').config()
const port = process.env.port // get port from .env
// require file stream to read and update files
const fs = require('fs')
// include the weather data to read
const weatherData = require('./data/weather.json')

app.get('/', (req, res) => {
	console.log('home route accessed')
	res.send('Welcome')
})

app.get('/weather', (req, res) => {
	console.log('getting weather')

	const lat = req.query.lat
	const lon = req.query.lon
	const searchQuery = req.query.searchQuery

	let place = weatherData.filter(location => {
		if (
			location.lat === lat &&
			location.city_name === searchQuery &&
			location.lon === lon
		) {
			return location
		}
	})

	place
		? res.status(200).send(place)
		: res.status(404).send('location not found')
})

app.use('*', (req, res) => {
	console.log(err)
	res.status(404).send('That page is not found! ):')
})

app.listen(port, (req, res) => {
	console.log(`Running on port: ${port}`)
	console.log(process.env.TEST_VAR)
})
