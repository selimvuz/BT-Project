import { NEWS_API_KEY } from './apiKeys.mjs';

const apiKey = NEWS_API_KEY;

export default async function getWeather(lat, lon) {
    var url = 'https://newsapi.org/v2/top-headlines?' +
        'sortBy=popularity&' +
        'country=tr&' +
        'pageSize=5&' +
        `apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Gündem bilgilerini alırken hata oluştu.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Gündem bilgilerini alırken hata:', error);
        throw error;
    }
}