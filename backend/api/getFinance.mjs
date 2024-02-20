import { FINANCE_API_KEY } from './apiKeys.mjs';

const apiKey = FINANCE_API_KEY;

export default async function searchCompanies(keyword) {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${FINANCE_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Şirket araması yapılırken hata oluştu.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Şirket araması yapılırken hata:', error);
        throw error;
    }
}
