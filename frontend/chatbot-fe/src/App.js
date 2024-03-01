import "./App.css";
import "./components/ChatContainer";
import ChatContainer from "./components/ChatContainer";
import Sidenav from "./components/Sidenav";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        Project Epoch 2024 - Chatbot Application v0.0.1
      </header>
      <Sidenav />
      <div className="main-container">
        <div className="chat-container">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
