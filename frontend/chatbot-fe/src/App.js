import React from 'react';
import './App.css';
import './components/ChatContainer';
import ChatContainer from './components/ChatContainer';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        BT Project 2024 - Chatbot Application
      </header>
      <div className="chat-container">
        <ChatContainer />
      </div>
    </div>
  );
}

export default App;