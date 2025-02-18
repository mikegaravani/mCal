import React from "react";
import Popup from "./Popup";
import "./Settings.css";

function Settings({ isOpen, onClose, onSave, children }) {
  return (
    <>
      <Popup isOpen={isOpen} onClose={onClose}>
        <div className="settings-container">
          <h2 className="settings-header">Settings</h2>
          <div className="settings-content">{children}</div>{" "}
          <div className="settings-actions">
            <button className="settings-close-btn" onClick={onClose}>
              Close
            </button>
            <button className="settings-save-btn" onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}

export default Settings;
