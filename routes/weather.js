const express = require('express')
// what is a router?
// make a 'branch' of our express 'app' called router
const router = express.Router()
// include the forecast object to send to the client
const Forecast = require('../Forecast')
// include axios to let the server also make requests
const axios = require('axios')

// let the router search for and handle its own routes starting at the
// route defined in server.js .... '/weather'

// this means to check (url)/weather/
router.post('/', async (req, res) => {
	console.log('getting weather')
	let status = {}
	let forecasts = []

	// get the query from request
	const lat = req.body.lat
	const lon = req.body.lon
	const searchQuery = req.body.searchQuery

	// request weather data
	let weatherData = await axios
		.get(`https://api.weatherbit.io/v2.0/current`, {
			// Params go directly into the queryString
			params: {
				lat: lat,
				lon: lon,
				//city: searchQuery,
				key: process.env.REACT_APP_WEATHER_BIT_ACCESS_TOKEN,
				units: 'i',
			},
		})
		.then(res => {
			// create forecast objects
			forecasts = res.data.data.map(forecast => {
				return new Forecast(forecast)
			})

			status.status = 200
			status.data = forecasts
		})
		.catch(err => {
			console.log('ERROR CALLING WEATHER API')
			console.log(err.message, '\n\n', err)

			status.data = `There is no weather data for ${searchQuery} right now.`
			status.status = 500
		})

	res.status(status.status).send(status.data)
})

module.exports = router
