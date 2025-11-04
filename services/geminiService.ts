
import { GoogleGenAI } from "@google/genai";
import type { WeatherData } from '../types';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

export const getWeatherDescription = async (weatherData: WeatherData): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const prompt = `
      You are a weather poet. Based on the following weather data, write a single, creative, and evocative sentence to describe the atmosphere.
      Do not repeat the raw data. Be imaginative and focus on the feeling of the weather.

      Weather Data:
      - Condition: ${weatherData.weather.main} (${weatherData.weather.description})
      - Temperature: ${weatherData.temp}°C
      - Feels Like: ${weatherData.feels_like}°C
      - City: ${weatherData.city}

      Example for sunny weather: "The city basks in a brilliant, warm embrace as the sun paints the sky in endless blue."
      Example for rainy weather: "A gentle rhythm of raindrops taps against the world, washing the streets in a cool, glistening sheen."

      Now, create a new one for the provided data.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error fetching Gemini description:", error);
    return "Could not generate a creative description at this time.";
  }
};
