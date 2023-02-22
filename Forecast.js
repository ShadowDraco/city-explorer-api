class Forecast {
	constructor(forecast) {
		this.date = forecast.datetime

		let descriptionTemplate = `Temperature of ${forecast.temp}, feels ${forecast.app_temp} with ${forecast.weather.description}`
		this.description = descriptionTemplate
		console.log(this)
	}
}
module.exports = Forecast
