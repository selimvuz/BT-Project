const handleGeoLocationError = (error, setMessages, messages) => {
  console.error("Konumu alırken hata:", error);
  const errorMessage = {
    id: messages.length + 1,
    text:
      error.message ||
      "Konum bilgileri bu tarayıcı üzerinde desteklenmiyor veya erişim izinleri reddedilmiş.",
    sender: "bot",
  };
  setMessages((messages) => [...messages, errorMessage]);
};

const handleApiError = (error, addMessage) => {
  console.error("API isteği sırasında hata oluştu:", error);
  addMessage("Üzgünüm ama istediğiniz işlemi şu anda gerçekleştiremiyoruz.");
};

export { handleGeoLocationError, handleApiError };
