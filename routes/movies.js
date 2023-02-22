const express = require('express')
const router = express.Router()

const axios = require('axios')

router.get('/', async (req, res) => {
	console.log('getting movies')
	let status = {}
	let movies = []

	const searchQuery = req.body.searchQuery

	let movieData = await axios
		.get('https://api.themoviedb.org/3/discover/movie?', {
			params: {
				language: 'en-US',
				with_keywords: searchQuery,
				api_key: process.env.REACT_APP_TMDB_ACCES_TOKEN,
			},
		})
		.then(res => {
			console.log(res.data)
			status = { status: 200, data: res.data }
		})
		.catch(err => {
			console.log(err.message, '\n\n', err)

			status = { status: 500, data: `Error finding movies from ${searchQuery}` }
		})

	res.status(status.status).send(status.data)
})

module.exports = router
