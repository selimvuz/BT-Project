import React, { useState } from 'react';
import '../styles/ChatContainer.css';
import Message from './Message';
import InputBar from './InputBar';
import QuickReplies from './QuickReplies';

const ChatContainer = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Merhaba, bugün size nasıl yardımcı olabilirim?", sender: 'bot' },
    ]);

    const handleSendMessage = (newMessageText) => {
        const newMessage = {
            id: messages.length + 1,
            text: newMessageText,
            sender: 'user'
        };
        setMessages([...messages, newMessage]);

        // "Bugün hava nasıl?" sorusunu kontrol edin
        if (newMessageText.includes("hava")) {
            handleWeatherRequest(); // Hava durumu bilgisini almak için fonksiyonu çağırın
        }
    };


    // Hızlı cevapları işleyecek fonksiyon
    const handleQuickReply = (replyText) => {
        // Kullanıcının hızlı cevap seçimini bir mesaj olarak ekle
        const newMessage = {
            id: messages.length + 1,
            text: replyText,
            sender: 'user'
        };
        setMessages([...messages, newMessage]);

        // "Bugün hava nasıl?" sorusunu kontrol edin
        if (replyText.includes("hava")) {
            handleWeatherRequest(); // Hava durumu bilgisini almak için fonksiyonu çağırın
        }
    };

    const handleWeatherRequest = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // API isteğini yaparak hava durumu bilgisini al
                try {
                    const response = await fetch('http://localhost:3001/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: "Bugün hava nasıl?",
                            lat: lat,
                            lon: lon,
                        }),
                    });
                    const data = await response.json();
                    // Hava durumu bilgisini içeren bir mesaj oluştur
                    const weatherMessage = {
                        id: messages.length + 1,
                        text: data.reply,
                        sender: 'bot'
                    };
                    // Oluşturulan mesajı mesajlar listesine ekle
                    setMessages(messages => [...messages, weatherMessage]);
                } catch (error) {
                    console.error('Hava durumunu alırken hata:', error);
                    // Hata mesajını kullanıcıya göster
                    const errorMessage = {
                        id: messages.length + 1,
                        text: "Üzgünüm ama hava durumu bilgilerini alırken bir sorun oluştu.",
                        sender: 'bot'
                    };
                    setMessages(messages => [...messages, errorMessage]);
                }
            }, (error) => {
                // Konum alınamadığında hata mesajı göster
                console.error('Konumu alırken hata:', error);
                const errorMessage = {
                    id: messages.length + 1,
                    text: "Konum bilgileri bu tarayıcı üzerinde desteklenmiyor veya erişim izinleri reddedilmiş.",
                    sender: 'bot'
                };
                setMessages(messages => [...messages, errorMessage]);
            });
        } else {
            // Tarayıcı geolokasyonu desteklemiyorsa hata mesajı göster
            console.log("Konum bilgisi bu tarayıcıda desteklenmiyor.");
            const errorMessage = {
                id: messages.length + 1,
                text: "Konum bilgisi bu tarayıcıda desteklenmiyor.",
                sender: 'bot'
            };
            setMessages(messages => [...messages, errorMessage]);
        }
    };


    // Hızlı cevaplarınızın listesi
    const quickReplies = ["Gündemde neler var?", "Bugün hava nasıl?"];

    return (
        <div className="chat-container">
            <div className="messages-wrapper">
                {messages.map((message) => (
                    <Message key={message.id} text={message.text} sender={message.sender} />
                ))}
            </div>
            <QuickReplies replies={quickReplies} onReplyClick={handleQuickReply} /> {/* Hızlı cevapları burada kullan */}
            <InputBar onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatContainer;
