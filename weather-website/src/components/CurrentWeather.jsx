import React from 'react'

const CurrentWeather = ({ data, unit }) => {
  const getWeatherIcon = (iconCode, isDay = true) => {
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

  const getTimeFromTimezone = (timezoneOffset) => {
    const now = new Date()
    const localTime = now.getTime() + (now.getTimezoneOffset() * 60000)
    const cityTime = new Date(localTime + (timezoneOffset * 1000))
    return cityTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="weather-card animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 text-shadow">
          {data.name}, {data.sys.country}
        </h2>
        <p className="text-white/70 capitalize text-lg">
          {data.weather[0].description}
        </p>
        <p className="text-white/60 text-sm mt-1">
          Local Time: {getTimeFromTimezone(data.timezone)}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="text-7xl md:text-8xl font-light text-white text-shadow mb-4 md:mb-0">
          {Math.round(data.main.temp)}{unit}
        </div>
        <div className="text-6xl md:text-7xl">
          {getWeatherIcon(data.weather[0].icon)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center bg-white/5 rounded-2xl p-4 backdrop-blur-md">
          <div className="text-white/70 text-sm mb-2">Feels Like</div>
          <div className="text-white font-bold text-xl">{Math.round(data.main.feels_like)}{unit}</div>
        </div>
        
        <div className="text-center bg-white/5 rounded-2xl p-4 backdrop-blur-md">
          <div className="text-white/70 text-sm mb-2">Humidity</div>
          <div className="text-white font-bold text-xl">{data.main.humidity}%</div>
        </div>
        
        <div className="text-center bg-white/5 rounded-2xl p-4 backdrop-blur-md">
          <div className="text-white/70 text-sm mb-2">Wind</div>
          <div className="text-white font-bold text-xl">{data.wind.speed} m/s</div>
        </div>
        
        <div className="text-center bg-white/5 rounded-2xl p-4 backdrop-blur-md">
          <div className="text-white/70 text-sm mb-2">Pressure</div>
          <div className="text-white font-bold text-xl">{data.main.pressure} hPa</div>
        </div>
      </div>

      <div className="border-t border-white/20 pt-6">
        <h4 className="text-white font-semibold mb-4 text-lg">Additional Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 backdrop-blur-md">
            <span className="text-white/70">Visibility:</span>
            <span className="text-white font-medium">{(data.visibility / 1000).toFixed(1)} km</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 backdrop-blur-md">
            <span className="text-white/70">Wind Direction:</span>
            <span className="text-white font-medium">{data.wind.deg}°</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 backdrop-blur-md">
            <span className="text-white/70">Cloudiness:</span>
            <span className="text-white font-medium">{data.clouds?.all || 0}%</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 backdrop-blur-md">
            <span className="text-white/70">Sunrise:</span>
            <span className="text-white font-medium">
              {new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeather