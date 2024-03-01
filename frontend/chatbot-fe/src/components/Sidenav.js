import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import React, { useState, useRef, useEffect } from "react";
import LoginPortal from "./LoginPortal";
import Login from "./Login";
import Register from "./Register";
import "../styles/Sidenav.css";

function Sidenav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const sidenavRef = useRef();

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
                <MenuItem onClick={() => setShowLogin(!showLogin)}>
                  Giriş
                </MenuItem>
                <LoginPortal
                  isOpen={showLogin}
                  onClose={() => setShowLogin(false)}
                >
                  <Login />
                </LoginPortal>
                <MenuItem onClick={() => setShowRegister(!showRegister)}>
                  Kayıt
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
                <MenuItem>Profil</MenuItem>
                <MenuItem
                  onClick={() => {
                    localStorage.removeItem("authToken"); // Çıkış yapılırken token'ı kaldır
                    setIsLoggedIn(false); // Kullanıcı durumunu güncelle
                  }}
                >
                  Çıkış Yap
                </MenuItem>
              </>
            )}
          </SubMenu>
          <SubMenu label="Modeller">
            <MenuItem>Trendyol LLM</MenuItem>
            <MenuItem>Gemini Pro</MenuItem>
          </SubMenu>
          <SubMenu label="Karakterler">
            <MenuItem>Gelecekten Bir Yolcu</MenuItem>
            <MenuItem>Sherlock Holmes</MenuItem>
            <MenuItem>Socrates</MenuItem>
            <MenuItem>YTÜ Profesörü</MenuItem>
          </SubMenu>
          <SubMenu label="Diğer">
            <MenuItem>İletişim</MenuItem>
            <MenuItem>Hakkında</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}

export default Sidenav;
