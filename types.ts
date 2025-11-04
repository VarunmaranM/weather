// The shape of the data that the getCoordinates service returns.
// This is used by App.tsx.
export interface GeoResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

// The raw response from the Open-Meteo Geocoding API.
// This is used internally by the weatherService.
export interface GeoAPIResponse {
  results: {
    name: string;
    latitude: number;
    longitude: number;
    country_code: string;
  }[];
}

// The raw response from the Open-Meteo Weather API.
export interface WeatherAPIResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}


// The consolidated weather data structure used for rendering components.
export interface WeatherData {
    city: string;
    country: string;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
        main: string;
        description: string;
        icon: string;
    };
}
