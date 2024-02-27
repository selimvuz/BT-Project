import { handleApiError } from "./errorService";

export const handleNewsRequest = async (addMessage) => {
  try {
    const response = await fetch("http://localhost:3001/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Haber servisine erişilemiyor");
    }
    const data = await response.json();
    let index = 1;

    addMessage("İşte gündemdeki popüler 5 haber:");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (const article of data.articles) {
      addMessage(`${index}. ${article.title}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      index++;
    }
  } catch (error) {
    console.error("Haberleri alırken hata:", error);
    handleApiError(error, addMessage);
  }
};
