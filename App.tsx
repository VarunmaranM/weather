import React, { useState, useCallback } from 'react';
import { Background } from './components/Background';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { getCoordinates, getWeather, mapWmoCodeToWeather } from './services/weatherService';
import { getWeatherDescription } from './services/geminiService';
import type { WeatherData } from './types';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [geminiDescription, setGeminiDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (city: string) => {
    if (!city) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setGeminiDescription('');

    try {
      const geoData = await getCoordinates(city);
      if (!geoData) {
        throw new Error(`Could not find coordinates for "${city}". Please check the city name.`);
      }

      const currentWeatherData = await getWeather(geoData.lat, geoData.lon);
      
      const weatherInfo = mapWmoCodeToWeather(currentWeatherData.current.weather_code);
      
      const consolidatedData: WeatherData = {
        city: geoData.name,
        country: geoData.country,
        temp: Math.round(currentWeatherData.current.temperature_2m),
        feels_like: Math.round(currentWeatherData.current.apparent_temperature),
        humidity: currentWeatherData.current.relative_humidity_2m,
        wind_speed: Math.round(currentWeatherData.current.wind_speed_10m),
        weather: {
          main: weatherInfo.main,
          description: weatherInfo.description,
          icon: weatherInfo.main.toLowerCase(),
        },
      };
      
      setWeatherData(consolidatedData);

      // Fetch Gemini description after setting weather data
      const description = await getWeatherDescription(consolidatedData);
      setGeminiDescription(description);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const weatherCondition = weatherData?.weather.main || 'Default';

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center p-4 sm:p-6 md:p-8 transition-colors duration-500">
      <Background weatherCondition={weatherCondition} />
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="w-full mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-shadow-lg">
            Weather App
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-2 text-shadow">
            Real-time weather with a touch of AI poetry
          </p>
        </header>
        
        <main className="w-full flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-md mb-8">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>

          <div className="w-full max-w-md min-h-[350px] flex items-center justify-center">
            {loading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {!loading && !error && weatherData && (
              <WeatherCard weatherData={weatherData} geminiDescription={geminiDescription} />
            )}
            {!loading && !error && !weatherData && (
                <div className="text-center text-white/70 p-8 rounded-2xl bg-black/20 backdrop-blur-sm">
                    <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
                    <p>Enter a city name above to see the current weather.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;