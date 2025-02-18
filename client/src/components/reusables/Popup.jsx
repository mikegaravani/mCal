import React, { useState } from "react";

function Popup({ children, isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }
  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <button style={closeButtonStyle} onClick={onClose}></button>
        {children}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "380px",
  maxWidth: "90%",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};

export default Popup;
