import React, { useState } from "react";

const DEFAULT_FOCUS = "30";
const DEFAULT_RELAX = "5";
const DEFAULT_CYCLES = "infinity";

function EPForm({ onStart }) {
  const [focusValue, setFocusValue] = useState(DEFAULT_FOCUS);
  const [relaxValue, setRelaxValue] = useState(DEFAULT_RELAX);
  const [cyclesValue, setCyclesValue] = useState(DEFAULT_CYCLES);
  const [customFocus, setCustomFocus] = useState("");
  const [customRelax, setCustomRelax] = useState("");
  const [customCycles, setCustomCycles] = useState("");

  const handleStartClick = () => {
    // Even after handleCustomXXXChange, the customXXX state might still be invalid

    // Validate Focus
    let validatedFocus = focusValue === "custom" ? customFocus : focusValue;
    if (focusValue === "custom") {
      if (validatedFocus === "" || isNaN(validatedFocus)) {
        validatedFocus = DEFAULT_FOCUS;
      } else if (parseInt(validatedFocus, 10) <= 0) {
        validatedFocus = "1";
      } else if (parseInt(validatedFocus, 10) >= 1000) {
        validatedFocus = "999";
      }
    }

    // Validate Relax
    let validatedRelax = relaxValue === "custom" ? customRelax : relaxValue;
    if (relaxValue === "custom") {
      if (validatedRelax === "" || isNaN(validatedRelax)) {
        validatedRelax = DEFAULT_RELAX;
      } else if (parseInt(validatedRelax, 10) <= 0) {
        validatedRelax = "1";
      } else if (parseInt(validatedRelax, 10) >= 1000) {
        validatedRelax = "999";
      }
    }

    // Validate Cycles
    let validatedCycles = cyclesValue === "custom" ? customCycles : cyclesValue;
    if (cyclesValue === "custom") {
      if (validatedCycles === "" || isNaN(validatedCycles)) {
        validatedCycles = DEFAULT_CYCLES;
      } else if (parseInt(validatedCycles, 10) <= 0) {
        validatedCycles = "1";
      } else if (parseInt(validatedCycles, 10) >= 1000) {
        validatedCycles = "99";
      }
    }

    onStart(validatedFocus, validatedRelax, validatedCycles);

    setCustomFocus(validatedFocus);
    setCustomRelax(validatedRelax);
    setCustomCycles(validatedCycles);
  };

  const handleCustomFocusChange = (e) => {
    const value = e.target.value;
    if (value === "" || isNaN(value)) {
      setCustomFocus(DEFAULT_FOCUS);
    } else if (parseInt(value, 10) <= 0) {
      setCustomFocus("1");
    } else if (parseInt(value, 10) >= 1000) {
      setCustomFocus("999");
    } else {
      setCustomFocus(value);
    }
  };

  const handleCustomRelaxChange = (e) => {
    const value = e.target.value;
    if (value === "" || isNaN(value)) {
      setCustomRelax(DEFAULT_RELAX);
    } else if (parseInt(value, 10) <= 0) {
      setCustomRelax("1");
    } else if (parseInt(value, 10) >= 1000) {
      setCustomRelax("999");
    } else {
      setCustomRelax(value);
    }
  };

  const handleCustomCyclesChange = (e) => {
    const value = e.target.value;
    if (value === "" || isNaN(value)) {
      setCustomCycles(DEFAULT_CYCLES);
    } else if (parseInt(value, 10) <= 0) {
      setCustomCycles("1");
    } else if (parseInt(value, 10) >= 1000) {
      setCustomCycles("99");
    } else {
      setCustomCycles(value);
    }
  };

  return (
    <>
      <div className="flex-1">
        <div className="text-left text-xl font-semibold text-gray-800 mb-4">
          Start a new pomodoro...
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-left text-gray-700 font-medium mb-1">
              Focus:
            </label>
            <select
              value={focusValue}
              onChange={(e) => setFocusValue(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="custom">Custom</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="25">25 minutes</option>
              <option value="30">30 minutes</option>
              <option value="35">35 minutes</option>
              <option value="40">40 minutes</option>
              <option value="50">50 minutes</option>
              <option value="60">1 hour</option>
            </select>
            {focusValue === "custom" && (
              <input
                type="number"
                placeholder="Enter focus time in minutes:"
                value={customFocus}
                onBlur={handleCustomFocusChange}
                onChange={(e) => setCustomFocus(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-left text-gray-700 font-medium mb-1">
              Relax:
            </label>
            <select
              value={relaxValue}
              onChange={(e) => setRelaxValue(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="custom">Custom</option>
              <option value="3">3 minutes</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
            {relaxValue === "custom" && (
              <input
                type="number"
                placeholder="Enter relax time in minutes:"
                value={customRelax}
                onBlur={handleCustomRelaxChange}
                onChange={(e) => setCustomRelax(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-left text-gray-700 font-medium mb-1">
              Cycles:
            </label>
            <select
              value={cyclesValue}
              onChange={(e) => setCyclesValue(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="custom">Custom</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="infinity">∞</option>
            </select>
            {cyclesValue === "custom" && (
              <input
                type="number"
                placeholder="Enter number of cycles:"
                value={customCycles}
                onBlur={handleCustomCyclesChange}
                onChange={(e) => setCustomCycles(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>
          <button
            onClick={handleStartClick}
            className="bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-300 hover:text-white"
          >
            Start
          </button>
        </div>
      </div>
    </>
  );
}

export default EPForm;
