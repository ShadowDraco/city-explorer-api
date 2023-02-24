'use strict'

class Cache {
	constructor() {
		this.cache = {}
	}

	checkCache = key => {
		if (this.cache[key] && Date.now() - this.cache[key].timestamp < 500000) {
			console.log('Cache hit')
			return this.cache[key].data
		} else {
			console.log('Cache miss')
			return false
		}
	}

	updateCache = (key, data) => {
		this.cache[key] = {}
		this.cache[key].timestamp = Date.now()
		this.cache[key].data = data
	}
}

module.exports = Cache
