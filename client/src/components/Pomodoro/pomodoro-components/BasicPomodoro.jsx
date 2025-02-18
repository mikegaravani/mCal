import React, { useState, useEffect } from "react";
import PomodoroTimer from "./PomodoroTimer";
import lightbulb from "../../../assets/lightbulb.png";
import "./BasicPomodoro.css";
import MusicPopup from "./MusicPopup";

function BasicPomodoro({ initialFocusTime, initialRelaxTime, onSP }) {
  const [currentMode, setCurrentMode] = useState("focus");

  const [isSPPrompted, setIsSPPrompted] = useState(false);

  const handleSPPopup = () => {
    setIsSPPrompted(!isSPPrompted);
  };

  const handleStateChange = (mode) => {
    setCurrentMode(mode);
  };

  return (
    <>
      <div
        className={`bg-style ${
          currentMode === "focus" ? "bg-focus" : "bg-relax"
        }`}
      >
        <div className="header-container">
          <h1
            className={`header-style ${
              currentMode === "focus" ? "header-focus" : "header-relax"
            }`}
          >
            Your pomodoro, user
          </h1>
        </div>
        <div className="content-wrapper-style">
          <div
            className={`container-style ${
              currentMode === "focus" ? "container-focus" : "container-relax"
            }`}
          >
            {/* SESSION PLANNER */}
            <button
              className={`button-style ${
                currentMode === "focus" ? "button-focus" : "button-relax"
              }`}
              onClick={handleSPPopup}
              style={{ backgroundImage: `url(${lightbulb})` }}
            ></button>

            <div className="timer-container-style">
              <PomodoroTimer
                initialFocusTime={initialFocusTime}
                initialRelaxTime={initialRelaxTime}
                onStateChange={handleStateChange}
              />
            </div>
          </div>
        </div>

        {/* Go to Session Planner POPUP */}
        {isSPPrompted && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Are you sure?
              </h2>
              <p className="text-gray-600 mb-6">
                Do you want to start a pomodoro with the help of Session
                Planner? You will abandon your current pomodoro.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleSPPopup}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  No, I'll stay here
                </button>
                <button
                  onClick={onSP}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <MusicPopup />
      </div>
    </>
  );
}

export default BasicPomodoro;
