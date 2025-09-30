import React, { useState } from 'react'

const SearchBar = ({ onSearch, loading, currentCity }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setQuery('')
    }
  }

  const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Mumbai', 'Singapore']

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search for a city... (Current: ${currentCity})`}
            className="w-full px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-lg font-medium"
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white px-6 py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed backdrop-blur-md border border-white/30 font-semibold"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {popularCities.map((city) => (
          <button
            key={city}
            onClick={() => onSearch(city)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white/80 hover:text-white transition-all duration-300 text-sm backdrop-blur-md border border-white/20"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar