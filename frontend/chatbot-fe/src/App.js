import "./App.css";
import "./components/ChatContainer";
import ChatContainer from "./components/ChatContainer";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import React, { useState } from "react";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        BT Project 2024 - Chatbot Application
      </header>
      <div className="main-container">
        <div className="sidebar">
          <Sidebar>
            <Menu>
              <SubMenu label="Kullanıcı">
                {!isLoggedIn ? (
                  <>
                    <MenuItem> Giriş</MenuItem>
                    <MenuItem> Kayıt </MenuItem>
                  </>
                ) : (
                  <MenuItem> Profil </MenuItem>
                )}
              </SubMenu>
              <SubMenu label="Modeller">
                <MenuItem>Trendyol LLM</MenuItem>
                <MenuItem>Gemini Pro</MenuItem>
              </SubMenu>
            </Menu>
          </Sidebar>
        </div>

        <div className="chat-container">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
