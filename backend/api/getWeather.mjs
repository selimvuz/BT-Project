import { WEATHER_API_KEY } from './apiKeys.mjs';

const apiKey = WEATHER_API_KEY;

export default async function getWeather(lat, lon) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Hava bilgilerini alırken hata oluştu.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hava bilgilerini alırken hata:', error);
        throw error;
    }
}