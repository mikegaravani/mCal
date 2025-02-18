import React, { useState, useEffect } from "react";
import hideIcon from "../../../assets/minus-sign.png";

function SPBForm({ onChange = () => {} }) {
  const [hours, setHours] = useState("2");
  const [minutes, setMinutes] = useState("30");

  const [cyclesType, setCyclesType] = useState("long");
  const [selectedIntensity, setSelectedIntensity] = useState("2");

  const [isBoxHidden, setIsBoxHidden] = useState(false);

  const handleHoursChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value >= 0 && value <= 23) {
      setHours(value.toString());
      onChange({
        hours: value,
        minutes: parseInt(minutes, 10),
        intensity: selectedIntensity,
        cyclesType,
      });
    }
  };

  const handleMinutesChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value >= 0 && value <= 59) {
      setMinutes(value.toString());
      onChange({
        hours: parseInt(hours, 10),
        minutes: value,
        intensity: selectedIntensity,
        cyclesType,
      });
    }
  };

  const handleCyclesType = (type) => {
    setCyclesType(type);
    onChange({
      hours: parseInt(hours, 10),
      minutes: parseInt(minutes, 10),
      intensity: selectedIntensity,
      cyclesType: type,
    });
  };

  const handleIntensitySelection = (intensity) => {
    setSelectedIntensity(intensity);
    onChange({
      hours: parseInt(hours, 10),
      minutes: parseInt(minutes, 10),
      intensity: intensity,
      cyclesType,
    });
  };

  const handleBoxHide = () => {
    setIsBoxHidden(!isBoxHidden);
  };

  return (
    <>
      <div className="flex-1 lg:text-lg">
        {/* TITLE STYLES */}
        {/* <div className="text-left text-xl font-semibold text-gray-800 mb-4">
          Settings
        </div> */}

        {/* <Alert /> */}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-left text-gray-700 font-bold mb-1">
              Choose your total session length:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={hours}
                onChange={handleHoursChange}
                className="w-16 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2"
                min="0"
                max="23"
              />
              <span>{hours === "1" ? "hour" : "hours"} and</span>
              <input
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                className="w-16 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                min="0"
                max="59"
              />
              <span>{minutes === "1" ? "minute" : "minutes"}</span>
            </div>

            <label className="text-left text-gray-700 font-bold mb-1 mt-6">
              Choose your session intensity:
            </label>
            <div className="flex justify-evenly gap-3 lg:h-16 text-sm lg:text-xl">
              <button
                type="button"
                className={`flex-1 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 focus:outline-none hover:text-white 
                  ${
                    selectedIntensity === "1"
                      ? "bg-black text-white"
                      : "bg-blue-500 hover:bg-blue-400 text-white"
                  }`}
                onClick={() => handleIntensitySelection("1")}
              >
                CHILL
              </button>
              <button
                type="button"
                className={`flex-1 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 focus:outline-none hover:text-white
                  ${
                    selectedIntensity === "2"
                      ? "bg-black text-white"
                      : "bg-blue-500 hover:bg-blue-400 text-white"
                  }`}
                onClick={() => handleIntensitySelection("2")}
              >
                MEDIUM
              </button>
              <button
                type="button"
                className={`flex-1 font-medium rounded-lg px-5 py-2.5 me-0 mb-2 focus:outline-none hover:text-white
                  ${
                    selectedIntensity === "3"
                      ? "bg-black text-white"
                      : "bg-blue-500 hover:bg-blue-400 text-white"
                  }`}
                onClick={() => handleIntensitySelection("3")}
              >
                INTENSE
              </button>
            </div>

            <div
              className={`bg-gray-200 rounded-lg mt-1 px-4 py-3 relative   ${
                isBoxHidden ? "pb-5" : ""
              }`}
            >
              {/* HIDE TAB BUTTON */}
              <button
                type="button"
                className={`absolute top-2 right-4 rounded hover:bg-gray-300`}
                onClick={handleBoxHide}
              >
                <img src={hideIcon} alt="Hide" className="h-4 w-4" />
              </button>

              <p className={`font-bold ${isBoxHidden ? "hidden" : ""}`}>
                About the session intensities:
              </p>
              <p className={`text-sm ${isBoxHidden ? "hidden" : ""}`}>
                You can choose the ratio of relax time to focus time. By
                default, the <span className="font-semibold">CHILL</span>{" "}
                session has 23% relax, the{" "}
                <span className="font-semibold">MEDIUM</span> has 17%, and if
                you're really feeling it, the{" "}
                <span className="font-semibold">INTENSE</span> has only 10%
                relax time.
              </p>
            </div>

            <label className="text-left text-gray-700 font-bold mb-1 mt-6">
              Choose your cycle length:
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="longer-focus"
                  checked={cyclesType === "long"}
                  onChange={() => handleCyclesType("long")}
                  className="mr-2"
                />
                <label htmlFor="longer-focus" className="text-gray-700">
                  Longer focus times, longer relax times
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="shorter-focus"
                  checked={cyclesType === "short"}
                  onChange={() => handleCyclesType("short")}
                  className="mr-2"
                />
                <label htmlFor="shorter-focus" className="text-gray-700">
                  Shorter focus times, shorter relax times
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SPBForm;
