import React from "react";
import lightbulbBlack from "../../../assets/lightbulb-black.png";

function EPSessionTip({ onSPClick }) {
  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="text-left text-xl font-semibold text-gray-800 mb-4">
          ...or try the Session Planner!
        </div>
        <div className="flex flex-row gap-4 items-center my-4">
          <img
            src={lightbulbBlack}
            alt="lightbulb"
            className="w-20 h-20 lg:w-40 lg:h-40 object-cover"
          ></img>
          <h6 className="text-center text-gray-700 font-medium mb-1">
            Carefully craft your studying/working session, by optimizing your
            time based on your preferred pace!
          </h6>
        </div>
        <button
          onClick={onSPClick}
          className="mt-4 flex justify-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-300 hover:text-white"
        >
          SESSION PLANNER
        </button>
      </div>
    </>
  );
}

export default EPSessionTip;
