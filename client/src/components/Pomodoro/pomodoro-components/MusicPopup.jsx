import React, { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import musicTrack from "../../../assets/music/vaporwave.mp3";

const MusicPopup = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <div className="fixed bottom-0 right-0 w-full flex justify-center items-end">
      <div
        className={`bg-white shadow-lg rounded-t-lg w-full max-w-md transition-transform duration-300 ${
          isPopupVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          className="bg-white text-black text-center p-2 rounded-t-lg cursor-pointer"
          onClick={togglePopup}
        >
          <span className="text-lg">🎵 Your music</span>
        </div>
        <div className={`p-4 ${isPopupVisible ? "block" : "hidden"}`}>
          <AudioPlayer
            src={musicTrack}
            loop={true}
            showFilledProgress={false}
          />
        </div>
      </div>
      {!isPopupVisible && (
        <button
          className="fixed bottom-4 right-4 bg-white text-white p-3 rounded-full shadow-lg"
          onClick={togglePopup}
        >
          🎵
        </button>
      )}
    </div>
  );
};

export default MusicPopup;
