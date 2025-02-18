import React from "react";
import Timeline from "../../reusables/Timeline";

function SPProgress({ timelineData }) {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Next up:</h2>
        <Timeline items={timelineData} />
      </div>
    </>
  );
}

export default SPProgress;
