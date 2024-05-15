import React, { useState, useEffect } from 'react';
import './../styles/Message.css';

const Message = ({ text, sender }) => {
    const [displayedText, setDisplayedText] = useState('');
    const messageClass = sender === 'user' ? 'message user' : 'message bot';
    const senderName = sender === 'user' ? 'Kullanıcı' : 'Bot';

    // Mesajın saati için bir state ekleyin
    const [messageTime, setMessageTime] = useState('');

    // İlk harfi büyük yapan fonksiyon
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
        if (text) {
            // Mesaj gönderildiğinde saati ayarlayın
            const currentTime = new Date();
            setMessageTime(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

            // İlk harfi büyük yap
            const capitalizedText = capitalizeFirstLetter(text);

            const intervalId = setInterval(() => {
                setDisplayedText((currentDisplayedText) => {
                    if (currentDisplayedText.length < capitalizedText.length) {
                        return currentDisplayedText + capitalizedText.charAt(currentDisplayedText.length);
                    }
                    clearInterval(intervalId);
                    return currentDisplayedText;
                });
            }, 10); // Her harf için 10ms gecikme

            return () => clearInterval(intervalId); // Cleanup fonksiyonu
        }
    }, [text]);

    return (
        <div className={messageClass}>
            <div className="sender-name">{senderName} - <span className="message-time">{messageTime}</span></div>
            <div className="message-text">{displayedText}</div>
        </div>
    );
};

export default Message;
