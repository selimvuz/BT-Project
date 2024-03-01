import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const LoginPortal = ({ isOpen, onClose, children }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const sidenav = document.querySelector(".sidebar");
    if (sidenav && isOpen) {
      const { right, top } = sidenav.getBoundingClientRect();
      setStyle({
        position: "absolute",
        top: `${top + 50}px`,
        left: `${right + 10}px`,
        zIndex: `100`,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const element = document.getElementById("portal-root");
      if (element && !element.contains(event.target)) {
        onClose(); // Portal'ı kapat
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={style}>{children}</div>,
    document.getElementById("portal-root")
  );
};

export default LoginPortal;
