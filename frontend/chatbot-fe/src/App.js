import "./App.css";
import ChatContainer from "./components/ChatContainer";
import Sidenav from "./components/Sidenav";
import React, { useState } from "react";

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState("Chatbot Application v0.0.1");

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="app">
      <header className="app-header">
        Project Epoch - {selectedCharacter}
      </header>
      <Sidenav onCharacterSelect={handleCharacterSelect} />
      <div className="main-container">
        <div className="chat-container">
          <ChatContainer selectedCharacter={selectedCharacter} />
        </div>
      </div>
    </div>
  );
}

export default App;
