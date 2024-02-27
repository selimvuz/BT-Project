const sendMessage = async (messageText) => {
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    });
    if (!response.ok) {
      throw new Error("Ağ cevabında sorun oluştu.");
    }
    const data = await response.json();
    return {
      id: Date.now(),
      text: data.reply,
      sender: "bot",
    };
  } catch (error) {
    console.error("Sohbet servisinde bir hata meydana geldi: ", error);
    throw error;
  }
};

export { sendMessage };
