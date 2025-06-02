import React, { useState, useEffect } from "react";
import Settings from "../../reusables/Settings";
import "./PomodoroTimer.css";

import addTimeIcon from "../../../assets/addtime.png";
import pauseIcon from "../../../assets/pause.png";
import playIcon from "../../../assets/play.png";
import settingsIcon from "../../../assets/settings.png";
import restartIcon from "../../../assets/restart.png";
import jumpIcon from "../../../assets/jump.png";
import CoffeeBrewingIcon from "./animations/CoffeeBrewingIcon";
import CouchIcon from "./animations/CouchIcon";

function PomodoroTimer({ initialFocusTime, initialRelaxTime, onStateChange }) {
  const [isFocus, setIsFocus] = useState(true);
  const [timeLeft, setTimeLeft] = useState(initialFocusTime);
  const [isRunning, setIsRunning] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [minutesToAdd, setMinutesToAdd] = useState(2);

  const [focusTime, setFocusTime] = useState(initialFocusTime);
  const [relaxTime, setRelaxTime] = useState(initialRelaxTime);

  const [settingsSnapshot, setSettingsSnapshot] = useState({
    minutesToAdd,
    focusTime,
    relaxTime,
    applyImmediately: true,
  });

  const maxMinutesToAddInSettings = 99;
  const maxFocusMinutesInSettings = 240;
  const maxRelaxMinutesInSettings = 240;

  const openSettings = () => {
    setSettingsSnapshot({
      minutesToAdd,
      focusTime,
      relaxTime,
      applyImmediately: true,
    });
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const saveSettings = () => {
    const {
      focusTime: newFocusTime,
      relaxTime: newRelaxTime,
      applyImmediately,
    } = settingsSnapshot;

    setFocusTime(newFocusTime);
    setRelaxTime(newRelaxTime);

    if (applyImmediately) {
      setTimeLeft(isFocus ? newFocusTime : newRelaxTime);
    }

    setIsSettingsOpen(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isFocus ? focusTime : relaxTime);
  };

  const switchState = () => {
    const nextIsFocus = !isFocus;
    setIsFocus(nextIsFocus);
    setTimeLeft(nextIsFocus ? focusTime : relaxTime);
    if (onStateChange) {
      onStateChange(nextIsFocus ? "focus" : "relax");
    }
  };

  const addMinutes = (minutes) => {
    setTimeLeft((prev) => prev + minutes * 60);
  };

  // Needed for changing the default "Add minutes" value
  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setMinutesToAdd("");
    } else {
      const numericValue = Number(value);
      if (numericValue > maxMinutesToAddInSettings) {
        setMinutesToAdd(maxMinutesToAddInSettings);
      } else if (numericValue >= 1) {
        setMinutesToAdd(numericValue);
      }
    }
  };

  const handleBlur = () => {
    if (minutesToAdd === "") {
      setMinutesToAdd(1);
    }
  };

  const handleTimeBlur = (key, previousValue) => {
    setSettingsSnapshot((prev) => {
      if (prev[key] === "") {
        return { ...prev, [key]: previousValue };
      }
      return prev;
    });
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      switchState();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  return (
    <>
      <div className={`timer-container ${isFocus ? "focus" : "relax"}`}>
        <div className="absolute top-[10px] right-[10px] h-[55px] w-[55px] rounded">
          {isFocus ? <CoffeeBrewingIcon /> : <CouchIcon />}
        </div>

        <h4 className={`timer-state ${isFocus ? "focus" : "relax"}`}>
          {isFocus ? "FOCUS" : "RELAX"}
        </h4>

        <h1 className="timer-time">{formatTime(timeLeft)}</h1>

        <div className="timer-buttons">
          {/* PLAY/PAUSE BUTTON */}
          <button
            className="timer-button tmr-play-pause"
            style={{
              backgroundImage: `url(${isRunning ? pauseIcon : playIcon})`,
            }}
            onClick={toggleTimer}
          ></button>

          {/* ADD MINUTES BUTTON */}
          <button
            className="timer-button tmr-add-minutes"
            style={{ backgroundImage: `url(${addTimeIcon})` }}
            onClick={() => addMinutes(minutesToAdd)}
          ></button>

          {/* RESTART BUTTON */}
          <button
            className="timer-button tmr-restart"
            style={{ backgroundImage: `url(${restartIcon})` }}
            onClick={resetTimer}
          ></button>

          {/* JUMP BUTTON */}
          <button
            className="timer-button tmr-jump"
            style={{ backgroundImage: `url(${jumpIcon})` }}
            onClick={switchState}
          ></button>

          {/* SETTINGS BUTTON */}
          <button
            className="timer-button tmr-settings"
            style={{ backgroundImage: `url(${settingsIcon})` }}
            onClick={openSettings}
          ></button>
        </div>

        <div className="timer-next-up">
          <h3 className="timer-next-up-text">
            Next up: {Math.floor(isFocus ? relaxTime / 60 : focusTime / 60)}{" "}
            minutes of {isFocus ? "relax" : "focus"}.
          </h3>
        </div>

        <Settings
          isOpen={isSettingsOpen}
          onClose={closeSettings}
          onSave={saveSettings}
        >
          <h6 className="settings-chapter">Session settings</h6>

          {/* Focus Time Input */}
          <label className="settings-label">
            Focus Time (Minutes):
            <input
              type="number"
              value={
                settingsSnapshot.focusTime === ""
                  ? ""
                  : Math.floor(settingsSnapshot.focusTime / 60)
              }
              onChange={(e) => {
                const value = e.target.value;
                setSettingsSnapshot((prev) => ({
                  ...prev,
                  focusTime:
                    value === ""
                      ? ""
                      : Math.max(
                          1,
                          Math.min(Number(value), maxFocusMinutesInSettings)
                        ) * 60,
                }));
              }}
              onBlur={() => {
                handleTimeBlur("focusTime", focusTime);
              }}
            />
          </label>

          {/* Relax Time Input */}
          <label className="settings-label">
            Relax Time (Minutes):
            <input
              type="number"
              value={
                settingsSnapshot.relaxTime === ""
                  ? ""
                  : Math.floor(settingsSnapshot.relaxTime / 60)
              }
              onChange={(e) => {
                const value = e.target.value;
                setSettingsSnapshot((prev) => ({
                  ...prev,
                  relaxTime:
                    value === ""
                      ? ""
                      : Math.max(
                          1,
                          Math.min(Number(value), maxRelaxMinutesInSettings)
                        ) * 60,
                }));
              }}
              onBlur={() => {
                handleTimeBlur("relaxTime", relaxTime);
              }}
            />
          </label>

          {/* Apply Immediately Checkbox */}
          <label>
            <input
              type="checkbox"
              checked={settingsSnapshot.applyImmediately}
              onChange={(e) => {
                setSettingsSnapshot((prev) => ({
                  ...prev,
                  applyImmediately: e.target.checked,
                }));
              }}
            />{" "}
            Apply changes immediately
          </label>

          <br />

          <h6 className="settings-chapter">More settings</h6>

          {/* Time Increment Input */}
          <label className="settings-label">
            Time Increment (Minutes):
            <input
              type="number"
              className="settings-input"
              value={minutesToAdd === "" ? "" : minutesToAdd}
              onChange={handleMinutesChange}
              onBlur={handleBlur}
              min="1"
              max="maxMinutesToAddInSettings"
            />
          </label>
        </Settings>
      </div>
    </>
  );
}

export default PomodoroTimer;
