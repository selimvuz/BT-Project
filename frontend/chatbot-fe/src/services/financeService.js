import { FINANCE_API_KEY } from "./financeKey";

const ALPHA_VANTAGE_API_KEY = FINANCE_API_KEY;

const fetchApiData = async (url) => {
  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API isteği sırasında hata oluştu:", error);
    return null;
  }
};

// Kullanıcı girdisini işleme ve önerileri alma
export const processUserInputForSuggestions = async (
  keyword,
  setCompanyName,
  updateSuggestionsList
) => {
  setCompanyName(keyword);
  if (keyword.length > 1) {
    const data = await fetchApiData(
      `http://localhost:3001/search?keyword=${keyword}`
    );
    updateSuggestionsList(data ? data["bestMatches"] || [] : []);
  } else {
    updateSuggestionsList([]);
  }
};

export const getStockInformation = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  return await fetchApiData(url);
};
