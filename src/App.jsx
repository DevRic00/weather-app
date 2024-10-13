import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "07c7616e420642eb9a4110404241310"; // Your Weather API key
const CITIES = ["Cebu", "Davao", "Quezon City", "Makati", "Baguio"]; // Cities available for selection

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Cebu"); // Default city
  const [weatherData, setWeatherData] = useState({
    userWeather: null,
    selectedCityWeather: null,
    manilaWeather: null,
  });

  // Fetch weather for user location, selected city, and Manila
  const getWeather = async (lat, lon, city) => {
    try {
      const [userRes, selectedCityRes, manilaRes] = await Promise.all([
        axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`
        ),
        axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
        ),
        axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Manila`
        ),
      ]);

      setWeatherData({
        userWeather: userRes.data,
        selectedCityWeather: selectedCityRes.data,
        manilaWeather: manilaRes.data,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Use geolocation to get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          getWeather(latitude, longitude, selectedCity);
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch weather when the user selects a new city
  useEffect(() => {
    if (userLocation) {
      getWeather(userLocation.latitude, userLocation.longitude, selectedCity);
    }
  }, [selectedCity]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-green-300 to-green-500">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white mb-8">Weather Updates</h1>
        <div className="flex justify-center items-center mb-6">
          <label className="text-white mr-4" htmlFor="citySelect">
            Select a City:
          </label>
          <select
            id="citySelect"
            className="p-2 bg-white rounded"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full p-4">
          <WeatherCard title="Your Location" data={weatherData.userWeather} />
          <WeatherCard
            title={`${selectedCity}`}
            data={weatherData.selectedCityWeather}
          />
          <WeatherCard title="Manila" data={weatherData.manilaWeather} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const WeatherCard = ({ title, data }) => (
  <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg glassmorphic-card flex flex-col items-center justify-center">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {data ? (
      <>
        <p>
          {data.location.name}, {data.location.country}
        </p>
        <p className="text-2xl font-bold">{data.current.temp_c}°C</p>
        <p>{data.current.condition.text}</p>
      </>
    ) : (
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-12"></div>
      </div>
    )}
  </div>
);

const Footer = () => (
  <footer className="w-full bg-slate-50 text-black py-6">
    <div className="text-center">Made by Eric Peter Manalili</div>
    <div className="flex justify-center items-center mt-4">
      <span className="text-sm">Powered by</span>
      <a
        href="https://www.weatherapi.com/"
        title="Weather API"
        className="underline ml-2 text-sm"
      >
        WeatherAPI.com
      </a>
    </div>
    <div className="flex justify-center mt-2">
      <a href="https://www.weatherapi.com/" title="Free Weather API">
        <img
          src="//cdn.weatherapi.com/v4/images/weatherapi_logo.png"
          alt="Weather data by WeatherAPI.com"
          border="0"
          className="h-6"
        />
      </a>
    </div>
  </footer>
);

export default App;
