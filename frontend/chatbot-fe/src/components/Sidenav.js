import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import React, { useState, useRef, useEffect } from "react";
import LoginPortal from "./LoginPortal";
import Login from "./Login";
import Register from "./Register";
import "../styles/Sidenav.css";

function Sidenav({ onCharacterSelect, activeItem, onMenuItemClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const sidenavRef = useRef();

  const handleCharacterSelect = (character) => {
    onCharacterSelect(character);
  };

  const handleItemClick = (item) => {
    onMenuItemClick(item);
  };

  // Token'ı doğrulama işlevi
  const validateToken = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/validateToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("authToken"); // Token geçersizse kaldır
      }
    } catch (error) {
      console.error("Token doğrulama hatası:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    validateToken(); // Bileşen yüklendiğinde token'ı doğrula
  }, []);

  useEffect(() => {
    const updatePopupPosition = () => {
      // Her iki popup için de çalışacak şekilde genelleştirilmiş kod
      if (sidenavRef.current && (showLogin || showRegister)) {
        const { right, top } = sidenavRef.current.getBoundingClientRect();
        const popupLeft = right + 10;
        const popupTop = top;
        const popup = document.querySelector(".popup");
        if (popup) {
          popup.style.left = `${popupLeft}px`;
          popup.style.top = `${popupTop}px`;
        }
      }
    };

    window.addEventListener("resize", updatePopupPosition);
    updatePopupPosition();

    return () => window.removeEventListener("resize", updatePopupPosition);
  }, [showLogin, showRegister]); // Hem showLogin hem de showRegister değişikliklerini izle

  return (
    <div className="sidebar" ref={sidenavRef}>
      <Sidebar>
        <Menu>
          <SubMenu label="Kullanıcı">
            {!isLoggedIn ? (
              <>
                <MenuItem
                  className="menu-item"
                  onClick={() => {
                    setShowLogin(!showLogin);
                    handleItemClick('login');
                  }}
                >
                  {activeItem === 'login' ? '+ Giriş' : '- Giriş'}
                </MenuItem>
                <LoginPortal
                  isOpen={showLogin}
                  onClose={() => setShowLogin(false)}
                >
                  <Login />
                </LoginPortal>
                <MenuItem className="menu-item" onClick={() => setShowRegister(!showRegister)}>
                 - Kayıt
                </MenuItem>
                <LoginPortal
                  isOpen={showRegister}
                  onClose={() => setShowRegister(false)}
                >
                  <Register />
                </LoginPortal>
              </>
            ) : (
              <>
                <MenuItem
                  className="menu-item"
                  onClick={() => handleItemClick('profile')}
                >
                  {activeItem === 'profile' ? '+ Profil' : '- Profil'}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    localStorage.removeItem("authToken"); // Çıkış yapılırken token'ı kaldır
                    setIsLoggedIn(false); // Kullanıcı durumunu güncelle
                    handleItemClick(null);
                  }}
                >
                  Çıkış Yap
                </MenuItem>
              </>
            )}
          </SubMenu>
          <SubMenu label="Modeller">
            <MenuItem
              className="menu-item"
              onClick={() => handleItemClick('epoch')}
            >
              {activeItem === 'epoch' ? '+ Epoch v0.2' : '- Epoch v0.2'}
            </MenuItem>
          </SubMenu>
          <SubMenu label="Karakterler">
            <MenuItem
              className="menu-item"
              onClick={() => {
                handleCharacterSelect("Gelecekten Bir Yolcu");
                handleItemClick('traveler');
              }}
            >
              {activeItem === 'traveler' ? '+ Gelecekten Bir Yolcu' : '- Gelecekten Bir Yolcu'}
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => {
                handleCharacterSelect("Şaka Ustası Leo");
                handleItemClick('leo');
              }}
            >
              {activeItem === 'leo' ? '+ Şaka Ustası Leo' : '- Şaka Ustası Leo'}
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => {
                handleCharacterSelect("Sokrates");
                handleItemClick('socrates');
              }}
            >
              {activeItem === 'socrates' ? '+ Sokrates' : '- Sokrates'}
            </MenuItem>
          </SubMenu>
          <SubMenu label="Diğer">
            <MenuItem
              className="menu-item"
              onClick={() => handleItemClick('contact')}
            >
              {activeItem === 'contact' ? '+ İletişim' : '- İletişim'}
            </MenuItem>
            <MenuItem
              className="menu-item"
              onClick={() => handleItemClick('about')}
            >
              {activeItem === 'about' ? '+ Hakkında' : '- Hakkında'}
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}

export default Sidenav;