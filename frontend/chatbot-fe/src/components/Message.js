import React, { useState, useEffect } from 'react';
import './../styles/Message.css';

const Message = ({ text, sender }) => {
    const [displayedText, setDisplayedText] = useState('');
    const messageClass = sender === 'user' ? 'message user' : 'message bot';
    const senderName = sender === 'user' ? 'Kullanıcı' : 'Bot';

    // Mesajın saati için bir state ekleyin
    const [messageTime, setMessageTime] = useState('');

    useEffect(() => {
        if (text) {
            // Mesaj gönderildiğinde saati ayarlayın
            const currentTime = new Date();
            setMessageTime(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

            const intervalId = setInterval(() => {
                setDisplayedText((currentDisplayedText) => {
                    if (currentDisplayedText.length < text.length) {
                        return currentDisplayedText + text.charAt(currentDisplayedText.length);
                    }
                    clearInterval(intervalId);
                    return currentDisplayedText;
                });
            }, 10); // Her harf için 10ms gecikme

            return () => clearInterval(intervalId); // Cleanup fonksiyonu
        }
    }, [text]); // `text` prop'u değiştiğinde bu efekt tetiklenir.

    return (
        <div className={messageClass}>
            <div className="sender-name">{senderName} - <span className="message-time">{messageTime}</span></div>
            <div className="message-text">{displayedText}</div>
        </div>
    );
};

export default Message;
