import React, { useEffect, useState } from 'react'
import axios from "axios"
const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')

  const handleCountry =(e)=>setCountryFilter(e.target.value)
  
  useEffect(()=>{
    axios
      // .get("http://localhost:3000/countries")
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(country=> {
        setCountries(country.data)
        // console.log("countries", country.data)
      })
      .catch(err => console.log("Failed to fetch countries", err))
  },[])
  return (
    <div>
      <div >
        <label htmlFor="country">find countries</label>
        <input type="text" value={countryFilter} onChange ={handleCountry}/>
      </div>
      <div>
        <FilteredCountry filter={countryFilter} countries={countries}/>
      </div>
    </div>
  )
}
export default App

const FilteredCountry = ({filter, countries})=>{
  const [showDetailsFor, setShowDetailsFor] = useState(null)

  const countriesfiltered = countries.filter(
    country => country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  if (countriesfiltered.length >10){
    return <p>Too many matches, specify another filter</p>
  }
  else if(countriesfiltered.length >1){
    return (
      <ul>
        {
        countriesfiltered.map(country =>{
          const isExpanded = showDetailsFor === country.name.common
          return(
            <li key={country.name.common}>
              {country.name.common} {' '}
              <button onClick={()=>setShowDetailsFor(
                isExpanded? null: country.name.common
                )}
              >
                {isExpanded? "Hide" : 'Show'}
              </button>
              {isExpanded && (
              <>
                <CountryDetails country={country}/>
                {/*Optional chaining (?.) prevents crashes on countries without a capital */}
                <CapitalWeather capital={country.capital?.[0]} />
              </>
              )}
            </li>
          )
        })
        }
        
      </ul>
    )
  }
  else if(countriesfiltered.length === 1){
    const country = countriesfiltered[0]
    return (
    <div>
      <CountryDetails country={country}/>
      <CapitalWeather capital={country.capital?.[0]}/>
    </div>
    
    )
  }
  
  return <p>No matches found</p>
}

const CountryDetails = ({country})=>{
  const {name, capital, area, languages, flags} = country  
  return (
    <div>
      <h1>{name.common}</h1>
      <p>Capital {capital?.join(", ") || 'None'}</p>
      <p>Area {area}</p>
      <h2>Languages</h2>
      <ul>
        {
          Object.values(languages ||[{}])
            .map(lan=> <li key={lan}>{lan}</li>)
        }
      </ul>
      
      <div>
        <img src={flags?.png} alt={`Flag of ${name.common}`} width={150} />
      </div>
    </div>
  )
}
const CapitalWeather =({capital})=>{
  const [forecast, setForecast] = useState(null)

  const api_key = import.meta.env.VITE_WEATHER_API_KEY
  useEffect(()=>{
     axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then(res=>setForecast(res.data))
      .catch(err => console.log(`failed to fetch ${capital} weather`, err))
  },[capital])

  if (!forecast){
    return <p>Loading weather data...</p>
  }

  const {main:temperature, weather, wind} = forecast

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature {temperature.temp} Celsius</p>
      <img 
        src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} 
        alt={weather[0].description} />
      <p>Wind {wind.speed} m/s</p>
    </div>
  )
}