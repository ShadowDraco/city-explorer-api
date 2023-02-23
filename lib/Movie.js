class Movie {
	constructor(movie) {
		this.title = movie.title
		this.overview = movie.overview
		this.average_votes = movie.average_votes
		this.image_url = `https://image.tmdb.org/t/p/w185/${movie.poster_path}`
		this.popularity = movie.popularity
		this.released_on = movie.released_on
	}
}
module.exports = Movie
