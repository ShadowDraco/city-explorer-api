const express = require('express')
const router = express.Router()

const Movie = require('../lib/Movie')

const axios = require('axios')

// store previous requests to reference later
const Cache = require('../lib/cache.js')
const cache = new Cache()

// helper function for clean code
const createMovies = movies => {
	return movies.map(movie => {
		return new Movie(movie)
	})
}

router.get('/', async (req, res) => {
	console.log('getting movies')

	let status = {}

	const searchQuery = req.query.searchQuery

	const movieParams = {
		language: 'en-US',
		query: encodeURI(searchQuery),
		api_key: process.env.REACT_APP_TMDB_ACCESS_TOKEN,
	}

	// assign a key from query and check against cache
	let key = 'movies-' + searchQuery
	// see if movies are returned, otherwise its false
	let oldMovies = cache.checkCache(key)
	// update request status from movie request function
	status =
		oldMovies !== false
			? { status: 200, data: oldMovies }
			: await requestMovies(key, status, movieParams)

	// sent message to the client
	res.send(status.data).status(status.status)
})

const requestMovies = async (key, status, movieParams) => {
	let movies = []

	let movieData = await axios
		.get('https://api.themoviedb.org/3/search/movie', {
			// params go directly into the query string
			params: movieParams,
		})
		.then(res => {
			// create movie objects
			movies = createMovies(res.data.results)
			// add movies to the cache
			cache.updateCache(key, movies)

			// update message to the client
			status = { status: 200, data: movies }
		})
		.catch(err => {
			console.log(err.message, '\n\n', err.response)
			// update status error message to send to client
			status = { status: 500, data: `Error finding movies from ${searchQuery}` }
		})
	return status
}

module.exports = router
