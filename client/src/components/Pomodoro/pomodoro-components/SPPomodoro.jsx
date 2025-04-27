// Session Planner Pomodoro component
import React, { useState, useEffect } from "react";
import SPTimer from "./SPTimer";
import SPProgress from "./SPProgress";
import MusicPopup from "./MusicPopup";
import { useUserStore } from "@/store/useUserStore";

function SPPomodoro({ timelineData }) {
  const { user, fetchUser, loading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const [currentMode, setCurrentMode] = useState("FOCUS");
  const [progressData, setProgressData] = useState([
    ...timelineData.slice(1),
    {
      time: "You did it!",
      description: "THE END",
      color: "#7600bc",
    },
  ]);

  const handleStateChange = (mode) => {
    setCurrentMode(mode);
    setProgressData([...progressData.slice(1)]);
  };

  return (
    <>
      <div
        className={`flex flex-col min-h-full p-5 relative ${
          currentMode === "FOCUS"
            ? "bg-gradient-to-b from-[#f7f9fc] to-[#007bff4c]"
            : currentMode === "RELAX"
            ? "bg-gradient-to-b from-[#f7f9fc] to-[#28a7454c]"
            : "bg-gradient-to-b from-[#f7f9fc] to-[#7600bc4c]"
        }`}
      >
        <div className="text-center inline-block text-3xl text-gray-800 my-3 font-bold transition-transform duration-300 whitespace-nowrap">
          <h1 className="text-3xl lg:text-5xl font-bold">
            Your pomodoro, {loading ? "Loading..." : user?.username ?? "Guest"}
          </h1>
        </div>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col lg:flex-row justify-center items-center relative">
          {/* Timer Section */}
          <div
            className={`w-full lg:w-2/3 max-w-lg bg-gray-100 p-5 rounded-lg shadow-md border-8 mt-4 lg:mx-8 ${
              currentMode === "FOCUS"
                ? "border-blue-500"
                : currentMode === "RELAX"
                ? "border-green-500"
                : "border-purple-500"
            } text-center`}
          >
            <div className="mt-5">
              <SPTimer
                onStateChange={handleStateChange}
                timelineData={[
                  ...timelineData,
                  // Adding "THE END" item to the end of the timeline
                  {
                    time: "You did it!",
                    description: "THE END",
                    color: "#7600bc",
                  },
                ]}
              />
            </div>
          </div>

          {/* New Tab Section */}
          <div
            className={`${
              progressData.length === 0 ? "hidden" : ""
            } bg-gray-100 p-5 rounded-lg shadow-md w-full lg:w-1/4 mt-4 mb-0 lg:mt-0 lg:max-h-[500px] lg:overflow-y-scroll`}
          >
            <SPProgress timelineData={progressData} />
          </div>
        </div>

        <MusicPopup />
      </div>
    </>
  );
}

export default SPPomodoro;
