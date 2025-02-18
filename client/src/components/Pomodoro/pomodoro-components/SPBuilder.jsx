import React, { useState, useCallback } from "react";
import arrowBack from "../../../assets/arrow-back.png";
import SPBForm from "./SPBForm";
import SPPopup from "./SPPopup";
import "./sessionCrafter";

function SPBuilder({ onStartSession, onPassData, onBack }) {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [sessionData, setSessionData] = useState({
    hours: 2,
    minutes: 30,
    intensity: "2",
    cyclesType: "long",
  });

  const handleFormChange = useCallback((newData) => {
    setSessionData(newData);
  }, []);

  const handleStart = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <>
      <div className="bg-gray-100 min-h-full flex flex-col items-center pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 lg:gap-4 pt-4 lg:pt-8 pl-4 lg:pl-8 self-start"
        >
          <img
            src={arrowBack}
            alt="Back Arrow"
            className="h-5 w-5 lg:h-7 lg:w-7"
          />
          <span className="text-gray-800 font-semibold text-base lg:text-3xl">
            Back
          </span>
        </button>
        <header className="text-start inline-block text-3xl text-gray-800 my-5 lg:mt-2 font-bold font-sans shadow-sm transition-transform duration-300 whitespace-nowrap">
          <h1 className="text-3xl lg:text-4xl font-bold">BUILD YOUR SESSION</h1>
        </header>

        <main className="flex flex-col justify-center items-stretch gap-8 mt-4 px-4 lg:px-16 w-full max-w-3xl">
          <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
            <SPBForm onChange={handleFormChange} />
          </div>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-300 hover:text-white"
          >
            Start
          </button>
        </main>
      </div>

      {/* SESSION CONFIRMATION POPUP */}
      {isPopupVisible && (
        <SPPopup
          onClose={handleClosePopup}
          sessionData={sessionData}
          onStartSession={onStartSession}
          onPassData={onPassData}
        />
      )}
    </>
  );
}

export default SPBuilder;
