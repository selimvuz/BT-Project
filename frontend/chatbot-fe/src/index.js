import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

function adjustChatContainerHeight() {
  var navbarHeight = document.querySelector('.app-header').offsetHeight; // Navigation bar'ın yüksekliğini al
  var chatContainer = document.querySelector('.chat-container');
  chatContainer.style.height = `calc(100vh - ${navbarHeight}px - 50px)`; // Yüksekliği ayarla
}

// Sayfa yüklendiğinde ve pencere yeniden boyutlandırıldığında ayarlamayı yap
window.onload = adjustChatContainerHeight;
window.onresize = adjustChatContainerHeight;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
