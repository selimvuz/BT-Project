import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatContainer.css";
import "../styles/LordIcon.css";
import Message from "./Message";
import InputBar from "./InputBar";
import QuickReplies, { quickReplies } from "./QuickReplies";
import LoadingIndicator from "./LoadingIndicator";
import LordIcon from "./LordIcon";
import { fetchWeather } from "../services/weatherService";
import { handleGeoLocationError } from "../services/errorService";
import { handleNewsRequest } from "../services/newsService";
import { sendMessage } from "../services/chatService";

const ChatContainer = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Merhaba, size nasıl yardımcı olabilirim?", sender: "bot" },
  ]);
  const [askForCompanyName, setAskForCompanyName] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null); // Mesajların sonunu işaretlemek için bir ref

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1200);
  }, [messages]);

  const clearMessages = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newMessage = {
        id: 999,
        text: "Sohbeti süpürdüm.",
        sender: "bot",
      };
      setMessages([newMessage]);
    }, 1000);
    setMessages([]);
  };

  const routeMessage = (newMessageText) => {
    // Kullanıcıdan gelen metni küçük harfe çevir
    const messageTextLowerCase = newMessageText.toLowerCase();

    if (messageTextLowerCase.includes("hava")) {
      setAskForCompanyName(false);
      handleWeatherRequest();
    } else if (messageTextLowerCase.includes("gündem")) {
      setAskForCompanyName(false);
      handleNewsRequest(addMessage);
    } else if (messageTextLowerCase.includes("hisse")) {
      handleFinanceRequest();
    } else {
      setAskForCompanyName(false);
      handleChatRequest(newMessageText);
    }
  };

  const handleChatRequest = async (newMessageText) => {
    setIsLoading(true);
    try {
      const replyMessage = await sendMessage(newMessageText);
      setMessages((messages) => [...messages, replyMessage]);
    } catch (error) {
      console.error("Mesajı gönderirken hata oluştu:", error);
      const errorMessage = {
        id: messages.length + 1,
        text: "Üzgünüm, mesajınızı işlerken bir sorun oluştu.",
        sender: "bot",
      };
      setMessages((messages) => [...messages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (newMessageText) => {
    setIsLoading(true);
    const newMessage = {
      id: messages.length + 1,
      text: newMessageText,
      sender: "user",
    };
    setMessages([...messages, newMessage]);

    setTimeout(() => {
      routeMessage(newMessageText);
    }, 500);
  };

  const handleQuickReply = (replyText) => {
    const newMessage = {
      id: messages.length + 1,
      text: replyText,
      sender: "user",
    };
    setMessages([...messages, newMessage]);

    routeMessage(replyText);
  };

  const handleWeatherRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const { success, data, error } = await fetchWeather(lat, lon);

          let message;
          if (success) {
            message = {
              id: messages.length + 1,
              text: data.reply,
              sender: "bot",
            };
          } else {
            message = {
              id: messages.length + 1,
              text: error,
              sender: "bot",
            };
          }
          setMessages((messages) => [...messages, message]);
        },
        (geoError) => {
          handleGeoLocationError(geoError);
        }
      );
    } else {
      const geoError = new Error("Konum bilgisi bu tarayıcıda desteklenmiyor.");
      handleGeoLocationError(geoError, setMessages, messages);
    }
  };

  const handleFinanceRequest = async () => {
    // Kullanıcıya şirket ismi sorma
    setAskForCompanyName(true);
    addMessage("Hangi şirketin bilgilerini istiyorsunuz?");
  };

  const handleCompanyNameChange = async (e) => {
    const keyword = e.target.value;
    setCompanyName(keyword);

    if (keyword.length > 1) {
      // En az 2 karakter girildiğinde arama yap
      try {
        const response = await fetch(
          `http://localhost:3001/search?keyword=${keyword}`,
          {
            method: "GET", // Önerileri almak için GET isteği
          }
        );
        const data = await response.json();
        setCompanySuggestions(data["bestMatches"] || []);
      } catch (error) {
        console.error("Şirket önerileri alınırken hata:", error);
      }
    } else {
      setCompanySuggestions([]);
    }
  };

  // Mesaj eklemek için kullanılacak fonksiyon
  const addMessage = (text) => {
    setMessages((messages) => [
      ...messages,
      { id: messages.length + 1, text: text, sender: "bot" },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        {messages.map((message) => (
          <Message
            key={message.id}
            text={message.text}
            sender={message.sender}
          />
        ))}
        {isLoading && <LoadingIndicator />} {/* Yükleme durumuna göre göster */}
        <div ref={messagesEndRef} /> {/* Bu div, listenin sonunu işaretler */}
        {askForCompanyName && (
          <div className="finance-cover">
            <input
              type="text"
              className="input-field-finance"
              value={companyName}
              onChange={handleCompanyNameChange}
              placeholder="Şirket ismi girin"
            />
            <ul className="search-results">
              {companySuggestions.slice(0, 5).map((suggestion) => (
                <li
                  key={suggestion["1. symbol"]}
                  className="search-result-item"
                >
                  {suggestion["2. name"]}
                </li>
              ))}
            </ul>
            <button
              className="send-button-finance"
              onClick={() => {
                /* Şirket bilgilerini getirme işlemi */
              }}
            >
              Gönder
            </button>
          </div>
        )}
      </div>
      <div className="trash-can">
        <LordIcon
          src="https://cdn.lordicon.com/wpyrrmcq.json"
          trigger="hover"
          onClick={clearMessages}
        />
      </div>
      <QuickReplies replies={quickReplies} onReplyClick={handleQuickReply} />{" "}
      <InputBar onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
