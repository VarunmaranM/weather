
import React, { useEffect, useState } from 'react';
import { WeatherIcon } from './WeatherIcon';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  weatherData: WeatherData;
  geminiDescription: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, geminiDescription }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [weatherData]);


  return (
    <div
      className={`w-full max-w-md p-6 sm:p-8 bg-black/20 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-lg text-white transform transition-all duration-500 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold">{weatherData.city}</h2>
          <p className="text-white/70">{weatherData.country}</p>
        </div>
        <div className="text-right">
          <p className="text-5xl sm:text-6xl font-extrabold tracking-tighter animate-pulse-slow">{weatherData.temp}°C</p>
          <p className="text-sm text-white/70">Feels like {weatherData.feels_like}°</p>
        </div>
      </div>

      <div className="my-8 flex items-center justify-center gap-4 text-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28">
            <WeatherIcon condition={weatherData.weather.main} />
        </div>
        <p className="text-2xl font-medium capitalize flex-1">{weatherData.weather.description}</p>
      </div>

      <div className="my-8">
        <p className="text-center text-lg italic text-blue-200/90 min-h-[56px]">
          {geminiDescription ? `"${geminiDescription}"` : <span className="inline-block w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>}
        </p>
      </div>

      <div className="flex justify-around text-center border-t border-white/10 pt-6">
        <div>
          <p className="text-sm text-white/70">Humidity</p>
          <p className="text-xl font-semibold">{weatherData.humidity}%</p>
        </div>
        <div>
          <p className="text-sm text-white/70">Wind Speed</p>
          <p className="text-xl font-semibold">{weatherData.wind_speed} km/h</p>
        </div>
      </div>
    </div>
  );
};
