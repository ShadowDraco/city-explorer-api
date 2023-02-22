const express = require('express')
const app = express()
// make dotenv work
require('dotenv').config()
const port = process.env.port // get port from .env

// include the weather data to read
const weatherData = require('./data/weather.json')
// include the forecast object to send to the client
// include the forecast object to send to the client
const Forecast = require('./Forecast')

const cors = require('cors')
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
	console.log('home route accessed')
	res.send('Welcome')
})

app.post('/weather', (req, res) => {
	console.log('getting weather')

	const lat = req.body.lat
	const lon = req.body.lon
	const searchQuery = req.body.searchQuery

	let forecasts
	let location = weatherData.filter(location => {
		if (
			// lat and lon are not accurate from the API to the JSON
			//location.lat === lat &&
			location.city_name === searchQuery
			//location.lon === lon
		) {
			console.log('found loc')
			return location
		} else {
			return false
		}
	})

	if (location.length > 0) {
		forecasts = location[0].data.map(forecast => {
			let description = `Low of ${forecast.low_temp}, high of ${forecast.high_temp} with ${forecast.weather.description}`
			return new Forecast(description, forecast.datetime)
		})

		res.status(200).send(forecasts)
	} else {
		res
			.status(500)
			.send(`no weather information for ${searchQuery} at the moment`)
	}
})

app.use('*', (req, res) => {
	res.status(404).send('That page is not found! ):')
})

app.listen(port, (req, res) => {
	console.log(`Running on port: ${port}`)
	console.log(process.env.TEST_VAR)
})
