import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatContainer.css";
import "../styles/LordIcon.css";
import "../styles/Finance.css";
import Message from "./Message";
import InputBar from "./InputBar";
import QuickReplies, { quickReplies } from "./QuickReplies";
import LoadingIndicator from "./LoadingIndicator";
import LordIcon from "./LordIcon";
import { fetchWeather } from "../services/weatherService";
import { handleGeoLocationError } from "../services/errorService";
import { handleNewsRequest } from "../services/newsService";
import {
  processUserInputForSuggestions,
  getStockInformation,
} from "../services/financeService";
import { sendMessage } from "../services/chatService";

const ChatContainer = ({ selectedCharacter }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Merhaba dostum, ben Sokrates. Bugün hangi konular üzerinde düşünmek istersin? Birlikte sorgulayarak doğruya ulaşmak için sabırsızlanıyorum. Yanıtlamamı istediğin herhangi bir soru var mı?", sender: "bot" },
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
      const fullMessageText = `${selectedCharacter} ${newMessageText}`;
      routeMessage(fullMessageText);
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

  // Öneri listesini güncelleme fonksiyonu
  const updateSuggestionsList = (suggestions) => {
    setCompanySuggestions(suggestions);
  };

  // Kullanıcıya bilgi sorma fonksiyonu
  const askUserForInfo = (message) => {
    setAskForCompanyName(true);
    addMessage(message);
  };

  // Finansal bilgi isteğini işleme
  const handleFinanceRequest = () => {
    askUserForInfo("Hangi şirketin bilgilerini istiyorsunuz?");
  };

  let debounceTimer;
  const debounce = (func, delay) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
  };

  // Şirket adı değişikliğini işleme
  const handleCompanyNameChange = (e) => {
    const keyword = e.target.value;
    setCompanyName(keyword);

    // Debounce uygulama
    debounce(() => {
      if (keyword.length > 2) {
        // Minimum 3 karakter kontrolü
        processUserInputForSuggestions(
          keyword,
          setCompanyName,
          updateSuggestionsList
        );
      }
    }, 500);
  };

  // Öneri seçme ve hisse bilgilerini alırken yükleme durumunu yönetme
  const handleSelectCompany = async (symbol) => {
    setAskForCompanyName(false);
    setIsLoading(true);
    try {
      const stockInfo = await getStockInformation(symbol);
      if (stockInfo["Global Quote"]) {
        const info = stockInfo["Global Quote"];
        const message = `
          Şirket: ${info["01. symbol"]}\n
          Son Fiyat: ${info["05. price"]}\n
          Değişim: ${info["09. change"]} (${info["10. change percent"]})\n
          Günün En Yüksek Fiyatı: ${info["03. high"]}\n
          Günün En Düşük Fiyatı: ${info["04. low"]}\n
          Açılış Fiyatı: ${info["02. open"]}\n
          Önceki Kapanış: ${info["08. previous close"]}
        `;
        addMessage(message);
      } else {
        addMessage("Hisse bilgisi alınamadı.");
      }
    } catch (error) {
      console.error("Hisse bilgileri alınırken hata oluştu:", error);
      addMessage("Hisse bilgilerini alırken bir sorun oluştu.");
    } finally {
      setIsLoading(false);
    }
    setAskForCompanyName(false);
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
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
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
                  onClick={() => handleSelectCompany(suggestion["1. symbol"])}
                >
                  {suggestion["2. name"]}
                </li>
              ))}
            </ul>
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