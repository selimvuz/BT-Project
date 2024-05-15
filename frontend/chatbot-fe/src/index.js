import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

function adjustChatContainerHeight() {
  setTimeout(() => {
    var navbarHeight = document.querySelector('.app-header').offsetHeight;
    var chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.style.height = `calc(100vh - ${navbarHeight}px - 50px)`;
    }
  }, 0);
}

window.onload = adjustChatContainerHeight;
window.onresize = adjustChatContainerHeight;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
