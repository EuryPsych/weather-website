import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import WeatherForecast from './components/WeatherForecast'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [city, setCity] = useState('London')
  const [unit, setUnit] = useState('metric')

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo_key'

  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unit}`
      )
      
      if (!currentWeatherResponse.ok) {
        if (currentWeatherResponse.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.')
        } else if (currentWeatherResponse.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API configuration.')
        } else if (currentWeatherResponse.status === 429) {
          throw new Error('API rate limit exceeded. Please wait a moment and try again.')
        } else {
          throw new Error('Failed to fetch weather data. Please try again later.')
        }
      }
      
      const currentData = await currentWeatherResponse.json()
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}`
      )
      
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data.')
      }
      
      const forecastData = await forecastResponse.json()
      
      setWeatherData(currentData)
      setForecastData(forecastData)
      setCity(cityName)
      
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
      console.error('Error fetching weather data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true)
    setError('')
    
    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      )
      
      if (!currentWeatherResponse.ok) {
        throw new Error('Failed to fetch location weather data.')
      }
      
      const currentData = await currentWeatherResponse.json()
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      )
      
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch location forecast data.')
      }
      
      const forecastData = await forecastResponse.json()
      
      setWeatherData(currentData)
      setForecastData(forecastData)
      setCity(currentData.name)
      
    } catch (err) {
      setError(err.message || 'Failed to get your location weather.')
      console.error('Error fetching weather by coordinates:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherByCoords(latitude, longitude)
        },
        (error) => {
          setLoading(false)
          setError('Unable to retrieve your location. Please enable location services or search for a city manually.')
          console.error('Geolocation error:', error)
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      )
    } else {
      setError('Geolocation is not supported by your browser.')
    }
  }

  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric'
    setUnit(newUnit)
    if (city) {
      fetchWeatherData(city)
    }
  }

  useEffect(() => {
    fetchWeatherData(city)
  }, [])

  const getBackgroundClass = () => {
    if (!weatherData) return 'gradient-bg'
    
    const weatherMain = weatherData.weather[0].main.toLowerCase()
    const temp = weatherData.main.temp
    
    if (weatherMain.includes('clear')) {
      return temp > 25 ? 'sunny-bg' : 'clear-bg'
    }
    if (weatherMain.includes('cloud')) return 'cloudy-bg'
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) return 'rainy-bg'
    if (weatherMain.includes('snow')) return 'snow-bg'
    if (weatherMain.includes('thunderstorm')) return 'storm-bg'
    if (weatherMain.includes('mist') || weatherMain.includes('fog') || weatherMain.includes('haze')) return 'fog-bg'
    
    return 'gradient-bg'
  }

  const getUnitSymbol = () => {
    return unit === 'metric' ? '°C' : '°F'
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${getBackgroundClass()}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow">
            🌤️ Weather Dashboard
          </h1>
          <p className="text-white/80 text-lg md:text-xl">
            Real-time weather updates powered by OpenWeatherMap
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex-1 w-full">
              <SearchBar 
                onSearch={fetchWeatherData} 
                loading={loading}
                currentCity={city}
              />
            </div>
            
            <button
              onClick={toggleUnit}
              className="px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 whitespace-nowrap font-semibold"
            >
              Switch to {unit === 'metric' ? '°F' : '°C'}
            </button>
            
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 disabled:bg-white/10 transition-all duration-300 whitespace-nowrap font-semibold"
            >
              📍 My Location
            </button>
          </div>
        </div>

        {API_KEY === 'demo_key' && (
          <div className="max-w-4xl mx-auto mb-6 animate-fade-in">
            <div className="bg-yellow-500/20 border border-yellow-500/50 text-white px-6 py-4 rounded-2xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <strong>⚠️ Demo Mode:</strong> Using limited demo data. 
                  <a 
                    href="https://openweathermap.org/api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-white ml-2"
                  >
                    Get your free API key
                  </a>
                </div>
                <a 
                  href="https://home.openweathermap.org/users/sign_up" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                  Sign Up Free
                </a>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-6 animate-fade-in">
            <div className="bg-red-500/20 border border-red-500/50 text-white px-6 py-4 rounded-2xl text-center backdrop-blur-md">
              ⚠️ {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="max-w-4xl mx-auto mb-6 animate-fade-in">
            <div className="weather-card text-white text-center animate-pulse-soft">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">Loading weather data...</p>
            </div>
          </div>
        )}

        {weatherData && forecastData && !loading && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto mb-6 text-center">
              <div className="text-white/80 text-lg">
                Showing weather for <strong className="text-white text-xl">{weatherData.name}, {weatherData.sys.country}</strong>
              </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <CurrentWeather 
                  data={weatherData} 
                  unit={getUnitSymbol()}
                />
              </div>
              
              <div className="lg:col-span-1">
                <WeatherForecast 
                  data={forecastData} 
                  unit={getUnitSymbol()}
                />
              </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="weather-card text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-3">💨</div>
                <h4 className="text-white/70 text-sm mb-2">Wind Speed</h4>
                <div className="text-white font-bold text-2xl">
                  {weatherData.wind.speed} m/s
                </div>
              </div>
              
              <div className="weather-card text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-3">🧭</div>
                <h4 className="text-white/70 text-sm mb-2">Wind Direction</h4>
                <div className="text-white font-bold text-2xl">
                  {weatherData.wind.deg}°
                </div>
              </div>
              
              <div className="weather-card text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-3">👁️</div>
                <h4 className="text-white/70 text-sm mb-2">Visibility</h4>
                <div className="text-white font-bold text-2xl">
                  {(weatherData.visibility / 1000).toFixed(1)} km
                </div>
              </div>
              
              <div className="weather-card text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-3">☁️</div>
                <h4 className="text-white/70 text-sm mb-2">Cloudiness</h4>
                <div className="text-white font-bold text-2xl">
                  {weatherData.clouds?.all || 0}%
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="max-w-4xl mx-auto mt-12 text-center animate-fade-in">
          <div className="text-white/60 text-sm">
            <p className="mb-2">
              Data provided by{' '}
              <a 
                href="https://openweathermap.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors font-medium"
              >
                OpenWeatherMap
              </a>
            </p>
            <p>
              Built with React & Tailwind CSS • 
              {' '}
              <a 
                href="https://github.com/EuryPsych/weather-website" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors font-medium"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App