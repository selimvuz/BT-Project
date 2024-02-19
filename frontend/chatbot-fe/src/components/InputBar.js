import React, { useState } from 'react';
import './../styles/InputBar.css'; // Stil dosyasını import ediyoruz

const InputBar = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!message.trim()) return;
        onSendMessage(message);
        setMessage(''); // Mesaj gönderildikten sonra input'u temizle
    };

    return (
        <form className="input-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                className="input-field"
                placeholder="Aklınızdan ne geçiyor?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="send-button">Gönder</button>
        </form>
    );
};

export default InputBar;
