import React, { useState, useEffect } from 'react';
import './../styles/Message.css';

const Message = ({ text, sender }) => {
    const [displayedText, setDisplayedText] = useState('');
    const messageClass = sender === 'user' ? 'message user' : 'message bot';
    const senderName = sender === 'user' ? 'Kullanıcı' : 'Bot';

    useEffect(() => {
        if (text) {
            const intervalId = setInterval(() => {
                setDisplayedText((currentDisplayedText) => {
                    // Sadece mevcut metnin uzunluğu toplam metinden kısa ise güncelleme yap
                    if (currentDisplayedText.length < text.length) {
                        return currentDisplayedText + text.charAt(currentDisplayedText.length);
                    }
                    clearInterval(intervalId); // Metnin sonuna ulaştığında intervali durdur
                    return currentDisplayedText; // Metnin sonuna ulaşıldıysa daha fazla güncelleme yapma
                });
            }, 50); // Her harf için 50ms gecikme

            return () => clearInterval(intervalId); // Cleanup fonksiyonu
        }
    }, [text]); // `text` prop'u değiştiğinde bu efekt tetiklenir.

    return (
        <div className={messageClass}>
            <div className="sender-name">{senderName}</div>
            <div className="message-text">{displayedText}</div>
        </div>
    );
};

export default Message;
