import { OPEN_METEO_GEO_URL, OPEN_METEO_DATA_URL } from '../constants';
import type { GeoResponse, GeoAPIResponse, WeatherAPIResponse } from '../types';

export const getCoordinates = async (city: string): Promise<GeoResponse | null> => {
  const response = await fetch(`${OPEN_METEO_GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!response.ok) {
    throw new Error('Failed to fetch coordinates. Network response was not ok.');
  }
  const data: GeoAPIResponse = await response.json();
  const result = data.results?.[0];

  if (result) {
    return {
      name: result.name,
      lat: result.latitude,
      lon: result.longitude,
      country: result.country_code,
    };
  }
  return null;
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherAPIResponse> => {
   const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    wind_speed_unit: 'kmh',
    timezone: 'auto'
  });
  const response = await fetch(`${OPEN_METEO_DATA_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data. Network response was not ok.');
  }
  return response.json();
};

export const mapWmoCodeToWeather = (code: number): { main: string; description: string } => {
  const descriptions: { [key: number]: { main: string; description: string } } = {
    0: { main: 'Clear', description: 'Clear sky' },
    1: { main: 'Clear', description: 'Mainly clear' },
    2: { main: 'Clouds', description: 'Partly cloudy' },
    3: { main: 'Clouds', description: 'Overcast' },
    45: { main: 'Mist', description: 'Fog' },
    48: { main: 'Mist', description: 'Depositing rime fog' },
    51: { main: 'Drizzle', description: 'Light drizzle' },
    53: { main: 'Drizzle', description: 'Moderate drizzle' },
    55: { main: 'Drizzle', description: 'Dense drizzle' },
    56: { main: 'Drizzle', description: 'Light freezing drizzle' },
    57: { main: 'Drizzle', description: 'Dense freezing drizzle' },
    61: { main: 'Rain', description: 'Slight rain' },
    63: { main: 'Rain', description: 'Moderate rain' },
    65: { main: 'Rain', description: 'Heavy rain' },
    66: { main: 'Rain', description: 'Light freezing rain' },
    67: { main: 'Rain', description: 'Heavy freezing rain' },
    71: { main: 'Snow', description: 'Slight snow fall' },
    73: { main: 'Snow', description: 'Moderate snow fall' },
    75: { main: 'Snow', description: 'Heavy snow fall' },
    77: { main: 'Snow', description: 'Snow grains' },
    80: { main: 'Rain', description: 'Slight rain showers' },
    81: { main: 'Rain', description: 'Moderate rain showers' },
    82: { main: 'Rain', description: 'Violent rain showers' },
    85: { main: 'Snow', description: 'Slight snow showers' },
    86: { main: 'Snow', description: 'Heavy snow showers' },
    95: { main: 'Thunderstorm', description: 'Thunderstorm' },
    96: { main: 'Thunderstorm', description: 'Thunderstorm with slight hail' },
    99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail' },
  };
  return descriptions[code] || { main: 'Default', description: 'Unknown weather condition' };
};
