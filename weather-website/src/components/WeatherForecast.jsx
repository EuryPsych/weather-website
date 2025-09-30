import React from 'react'

const WeatherForecast = ({ data, unit }) => {
  const getDailyForecasts = () => {
    const dailyForecasts = []
    const seenDates = new Set()
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!seenDates.has(date) && dailyForecasts.length < 5) {
        seenDates.add(date)
        dailyForecasts.push(item)
      }
    })
    
    return dailyForecasts
  }

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '⛅',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌦️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    }
    return iconMap[iconCode] || '🌤️'
  }

  const dailyForecasts = getDailyForecasts()

  return (
    <div className="weather-card h-fit">
      <h3 className="text-2xl font-bold text-white mb-6 text-shadow">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {dailyForecasts.map((day, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/20"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">
                {getWeatherIcon(day.weather[0].icon)}
              </span>
              <div>
                <div className="text-white font-semibold text-lg">
                  {formatDay(day.dt)}
                </div>
                <div className="text-white/70 text-sm capitalize">
                  {day.weather[0].description}
                </div>
              </div>
            </div>
            
            <div className="text-white font-bold text-2xl">
              {Math.round(day.main.temp)}{unit}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <h4 className="text-white font-semibold mb-3 text-lg">Forecast Summary</h4>
        <p className="text-white/70 text-sm leading-relaxed">
          {data.list.some(day => day.weather[0].main === 'Rain') 
            ? 'Rain expected in the coming days. Don\'t forget your umbrella! ☔' 
            : data.list.some(day => day.weather[0].main === 'Clouds')
            ? 'Mixed clouds and sunshine ahead. Perfect weather for outdoor activities! 🌤️'
            : 'Mostly clear skies ahead. Great weather for your plans! 🌞'
          }
        </p>
      </div>
    </div>
  )
}

export default WeatherForecast