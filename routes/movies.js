const express = require('express')
const router = express.Router()

const Movie = require('../lib/Movie')

const axios = require('axios')

// helper function for clean code
const createMovies = movies => {
	return movies.map(movie => {
		return new Movie(movie)
	})
}

router.post('/', async (req, res) => {
	console.log('getting movies')

	let status = {}
	let movies = []

	const searchQuery = req.body.searchQuery

	const movieParams = {
		language: 'en-US',
		query: encodeURI(searchQuery),
		api_key: process.env.REACT_APP_TMDB_ACCESS_TOKEN,
	}

	let movieData = await axios
		.get('https://api.themoviedb.org/3/search/movie', {
			// params go directly into the query string
			params: movieParams,
		})
		.then(res => {
			// create movie objects
			movies = createMovies(res.data.results)
			// update message to the client
			status = { status: 200, data: movies }
		})
		.catch(err => {
			console.log(err.message, '\n\n', err.response)
			// update status error message to send to client
			status = { status: 500, data: `Error finding movies from ${searchQuery}` }
		})

	// sent message to the client
	res.send(status.data).status(status.status)
})

module.exports = router
