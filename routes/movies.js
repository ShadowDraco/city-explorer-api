const express = require('express')
const router = express.Router()

const Movie = require('../Movie')

const axios = require('axios')

router.post('/', async (req, res) => {
	console.log('getting movies')
	let status = {}
	let movies = []

	const searchQuery = req.body.searchQuery

	let movieData = await axios
		.get('https://api.themoviedb.org/3/discover/movie', {
			params: {
				language: 'en-US',
				with_keywords: encodeURI(searchQuery),
				api_key: process.env.REACT_APP_TMDB_ACCESS_TOKEN,
			},
		})
		.then(res => {
			movies = res.data.results.map(movie => {
				return new Movie(movie)
			})

			status = { status: 200, data: movies }
		})
		.catch(err => {
			console.log(err.message, '\n\n', err)

			status = { status: 500, data: `Error finding movies from ${searchQuery}` }
		})

	res.send(status.data).status(status.status)
})

module.exports = router
