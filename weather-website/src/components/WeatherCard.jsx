import React from 'react'

const WeatherCard = ({ title, value, icon, unit = '', description = '' }) => {
  return (
    <div className="weather-card text-center hover:transform hover:scale-105 transition-all duration-300">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-white/70 text-sm mb-2">{title}</h4>
      <div className="text-white font-bold text-2xl mb-2">
        {value}{unit}
      </div>
      {description && (
        <p className="text-white/60 text-xs">{description}</p>
      )}
    </div>
  )
}

export default WeatherCard