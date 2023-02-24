const express = require('express')
// what is a router?
// make a 'branch' of our express 'app' called router
const router = express.Router()
// include the forecast object to send to the client
const Forecast = require('../lib/Forecast')
// include axios to let the server also make requests
const axios = require('axios')

// store previous requests to reference later
const Cache = require('../lib/Cache.js')
const cache = new Cache()

// let the router search for and handle its own routes starting at the
// route defined in server.js .... '/weather'

// this means to check (url)/weather/
router.get('/', async (req, res) => {
	console.log('getting weather')
	let status = {}
	const lat = req.query.lat
	const lon = req.query.lon
	const searchQuery = req.query.searchQuery

	const weatherParams = {
		lat: lat,
		lon: lon,
		city: searchQuery,
		key: process.env.REACT_APP_WEATHER_BIT_ACCESS_TOKEN,
		// fahrenheit, mph, etc
		units: 'i',
		days: 5,
	}

	// create a key to check against the cache
	const key = 'weather-' + lat + lon

	let oldWeather = cache.checkCache(key)

	status =
		oldWeather !== false
			? { status: 200, data: oldWeather }
			: await requestWeather(key, status, weatherParams)

	// send to client

	res.status(status.status).send(status.data)
})

const requestWeather = async (key, status, weatherParams) => {
	// make a request to the weather api and modify the status from the route that requested it.
	// get the query from request

	let forecasts = []

	// request weather data
	let weatherData = await axios
		.get(`https://api.weatherbit.io/v2.0/forecast/daily`, {
			// Params go directly into the queryString
			params: weatherParams,
		})
		.then(res => {
			// create forecast objects
			forecasts = res.data.data.map(forecast => {
				return new Forecast(forecast)
			})
			// add forecasts to the cache
			cache.updateCache(key, forecasts)

			// set items to send to client
			status = { status: 200, data: forecasts }
		})
		.catch(err => {
			console.log('ERROR CALLING WEATHER API')
			console.log(err.message, '\n\n', err.response.data)
			// set items to send to client
			status = {
				status: 500,
				data: `There is no weather data for ${weatherParams.searchQuery} right now.`,
			}
		})

	return status
}

module.exports = router
