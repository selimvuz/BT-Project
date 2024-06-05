import "./App.css";
import ChatContainer from "./components/ChatContainer";
import Sidenav from "./components/Sidenav";
import About from "./components/About";
import Contact from "./components/Contact";
import React, { useState } from "react";

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState("Sokrates");
  const [activeItem, setActiveItem] = useState("socrates");

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="app">
      <header className="app-header">
        Karakterler v0.2 - {selectedCharacter}
      </header>
      <Sidenav
        onCharacterSelect={handleCharacterSelect}
        activeItem={activeItem}
        onMenuItemClick={handleItemClick}
      />
      <div className="main-container">
        <div className="chat-container">
          {activeItem === "about" ? (
            <About />
          ) : activeItem === "contact" ? (
            <Contact />
          ) : (
            <ChatContainer selectedCharacter={selectedCharacter} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;