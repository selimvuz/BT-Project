import React from 'react';
import '../styles/LoadingIndicator.css'; // Animasyon için CSS stilini içe aktar

const LoadingIndicator = () => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className='loading-text'>İşleniyor...</p>
        </div>
    );
};

export default LoadingIndicator;
