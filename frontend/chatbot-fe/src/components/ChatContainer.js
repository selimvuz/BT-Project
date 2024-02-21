import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatContainer.css';
import Message from './Message';
import InputBar from './InputBar';
import QuickReplies from './QuickReplies';
import LoadingIndicator from './LoadingIndicator';
import LordIcon from './LordIcon';

const ChatContainer = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Merhaba, size nasıl yardımcı olabilirim?", sender: 'bot' },
    ]);
    const [askForCompanyName, setAskForCompanyName] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companySuggestions, setCompanySuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null); // Mesajların sonunu işaretlemek için bir ref

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 1200); // 1200 milisaniyelik bir gecikme
    }, [messages]);

    const clearMessages = () => {
        setMessages([]); // Mesaj listesini boş bir diziye ayarla
    };

    const handleSendMessage = (newMessageText) => {
        setIsLoading(true); // Mesaj işlenirken yükleme durumunu etkinleştir
        const newMessage = {
            id: messages.length + 1,
            text: newMessageText,
            sender: 'user'
        };
        setMessages([...messages, newMessage]);

        // Örnek olarak, botun cevabını simüle eden bir gecikme ekledim
        setTimeout(() => {
            if (newMessageText.includes("hava")) {
                setAskForCompanyName(false);
                handleWeatherRequest();
                setIsLoading(false);
            } else if (newMessageText.includes("gündem")) {
                setAskForCompanyName(false);
                handleNewsRequest();
                setIsLoading(false);
            } else if (newMessageText.includes("hisse")) {
                handleFinanceRequest();
                setIsLoading(false);
            } else {
                setAskForCompanyName(false);
                const sendMessageToServer = async () => {
                    try {
                        const response = await fetch('http://localhost:5000/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ message: newMessageText }),
                        });
                        const data = await response.json();

                        // Sunucudan alınan yanıtı bir bot mesajı olarak ekleyin
                        const replyMessage = {
                            id: messages.length + 1,
                            text: data.reply,
                            sender: 'bot',
                        };
                        setMessages(messages => [...messages, replyMessage]);
                        setIsLoading(false);
                    } catch (error) {
                        console.error('Mesajı gönderirken hata oluştu:', error);
                        // Hata durumunda kullanıcıya bilgi veren bir mesaj göster
                        const errorMessage = {
                            id: messages.length + 1,
                            text: "Üzgünüm, mesajınızı işlerken bir sorun oluştu.",
                            sender: 'bot',
                        };
                        setMessages(messages => [...messages, errorMessage]);
                        setIsLoading(false);
                    }
                };
                sendMessageToServer();
            }
        }, 5000); // 3 saniyelik bir gecikme simüle edin
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
            setAskForCompanyName(false);
            handleWeatherRequest(); // Hava durumu bilgisini almak için fonksiyonu çağırın
        } else if (replyText.includes("Gündemde neler var?")) {
            setAskForCompanyName(false);
            handleNewsRequest();
        } else if (replyText.includes("hisse")) {
            handleFinanceRequest();
        } else {
            setAskForCompanyName(false);
        }
    };

    const handleWeatherRequest = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // API isteğini yaparak hava durumu bilgisini al
                try {
                    const response = await fetch('http://localhost:3001/weather', {
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

    // Haber başlıklarını sırayla göndermek için bir fonksiyon
    const handleNewsRequest = async () => {
        try {
            const response = await fetch('http://localhost:3001/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            let index = 1;

            addMessage("İşte gündemdeki popüler 5 haber:");
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Her bir haber başlığını sırayla işle
            for (const article of data.articles) {
                // Yeni bir mesaj oluştur ve mevcut mesaj listesine ekle
                addMessage(index + '. ' + article.title);
                // Her haber başlığı arasında kısa bir bekleme süresi
                await new Promise(resolve => setTimeout(resolve, 1000));
                index++
            }
        } catch (error) {
            console.error('Haberleri alırken hata:', error);
            // Hata mesajını ekle
            addMessage("Üzgünüm ama haber bilgilerini alırken bir sorun oluştu.");
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

        if (keyword.length > 1) { // En az 2 karakter girildiğinde arama yap
            try {
                const response = await fetch(`http://localhost:3001/search?keyword=${keyword}`, {
                    method: 'GET', // Önerileri almak için GET isteği
                });
                const data = await response.json();
                setCompanySuggestions(data['bestMatches'] || []);
            } catch (error) {
                console.error('Şirket önerileri alınırken hata:', error);
            }
        } else {
            setCompanySuggestions([]); // Kelime silindiğinde önerileri temizle
        }
    };

    // Mesaj eklemek için kullanılacak fonksiyon
    const addMessage = (text) => {
        setMessages(messages => [...messages, { id: messages.length + 1, text: text, sender: 'bot' }]);
    };

    // Hızlı cevaplarınızın listesi
    const quickReplies = ["Gündemde neler var?", "Bugün hava nasıl?", "Günlük hisse senedi fiyatları"];

    return (
        <div className="chat-container">
            <div className="messages-wrapper">
                {messages.map((message) => (
                    <Message key={message.id} text={message.text} sender={message.sender} />
                ))}
                {isLoading && <LoadingIndicator />} {/* Yükleme durumuna göre göster */}
                <div ref={messagesEndRef} /> {/* Bu div, listenin sonunu işaretler */}
                {askForCompanyName && (
                    <div className='finance-cover'>
                        <input
                            type="text"
                            className="input-field-finance"
                            value={companyName}
                            onChange={handleCompanyNameChange}
                            placeholder="Şirket ismi girin"
                        />
                        <ul className="search-results">
                            {companySuggestions.slice(0, 5).map((suggestion) => (
                                <li key={suggestion['1. symbol']} className="search-result-item">{suggestion['2. name']}</li>
                            ))}
                        </ul>
                        <button className="send-button-finance" onClick={() => {/* Şirket bilgilerini getirme işlemi */ }}>Gönder</button>
                    </div>
                )}
            </div>
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <LordIcon
                    src="https://cdn.lordicon.com/wpyrrmcq.json"
                    trigger="hover"
                    style={{ width: '50px', height: '50px', cursor: 'pointer', filter: "drop-shadow(2px 2px 4px #ECECEC)" }} // İkon boyutunu ayarlayın
                    onClick={clearMessages}
                />
            </div>
            <QuickReplies replies={quickReplies} onReplyClick={handleQuickReply} /> {/* Hızlı cevapları burada kullan */}
            <InputBar onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatContainer;
