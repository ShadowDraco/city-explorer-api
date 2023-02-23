class Forecast {
	constructor(forecast) {
		
		let dateDay = new Date(forecast.datetime).getDay
		this.date = forecast.datetime

		let descriptionTemplate = `Temperature of ${forecast.temp}, feels ${forecast.app_temp} with ${forecast.weather.description}`
		this.description = descriptionTemplate
	}
}
module.exports = Forecast
