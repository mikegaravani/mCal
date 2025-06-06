import React, { useState, useEffect } from "react";
import BasicPomodoro from "./pomodoro-components/BasicPomodoro";
import SPPomodoro from "./pomodoro-components/SPPomodoro";
import EntryPage from "./pomodoro-components/EntryPage";
import SPBuilder from "./pomodoro-components/SPBuilder";
import { sessionCrafter } from "./pomodoro-components/sessionCrafter";
import { finitePomodoroCreator } from "./pomodoro-components/finitePomodoroCreator";

import { usePomodoroStore } from "@/store/usePomodoroStore";

// CONDITIONAL RENDERING

function Pomodoro() {
  const {
    pomodoroMinutes,
    breakMinutes,
    startFromDashboard,
    setStartFromDashboard,
    studyPlanSession,
    clearStudyPlanSession,
  } = usePomodoroStore();

  const INITIAL_FOCUS_TIME = pomodoroMinutes * 60;
  const INITIAL_RELAX_TIME = breakMinutes * 60;

  const [currentPage, setCurrentPage] = useState(
    startFromDashboard ? "basicPomodoro" : "entryPage"
  );

  const [timelineData, setTimelineData] = useState([
    sessionCrafter(2, 30, 2, true),
  ]);

  const [focusTime, setFocusTime] = useState(INITIAL_FOCUS_TIME);
  const [relaxTime, setRelaxTime] = useState(INITIAL_RELAX_TIME);

  useEffect(() => {
    if (startFromDashboard) {
      setStartFromDashboard(false);
    }
  }, [startFromDashboard]);

  useEffect(() => {
    if (studyPlanSession) {
      setCurrentPage("sPPomodoro");
      setTimelineData(
        finitePomodoroCreator(
          studyPlanSession.focusTime,
          studyPlanSession.breakTime,
          studyPlanSession.cycles
        )
      );
      clearStudyPlanSession();
    } else if (startFromDashboard) {
      setFocusTime(pomodoroMinutes * 60);
      setRelaxTime(breakMinutes * 60);
      setCurrentPage("basicPomodoro");
      setStartFromDashboard(false);
    }
  }, []);

  const handleStart = (focus, relax, cycles) => {
    if (cycles === "infinity") {
      setFocusTime(focus * 60);
      setRelaxTime(relax * 60);
      setCurrentPage("basicPomodoro");
    } else {
      setCurrentPage("sPPomodoro");
      setTimelineData(finitePomodoroCreator(focus, relax, cycles));
    }
  };

  const handleSPClick = () => {
    setCurrentPage("sPBuilder");
  };

  const handleSPStart = () => {
    setCurrentPage("sPPomodoro");
  };

  const handleBackToEntry = () => {
    setCurrentPage("entryPage");
  };

  const handleTimelineData = (data) => {
    setTimelineData(data);
  };

  return (
    <>
      {currentPage === "entryPage" && (
        <EntryPage onStart={handleStart} onSPClick={handleSPClick} />
      )}
      {currentPage === "basicPomodoro" && (
        <BasicPomodoro
          initialFocusTime={focusTime}
          initialRelaxTime={relaxTime}
          onSP={handleSPClick}
        />
      )}
      {currentPage === "sPBuilder" && (
        <SPBuilder
          onStartSession={handleSPStart}
          onPassData={handleTimelineData}
          onBack={handleBackToEntry}
        />
      )}
      {currentPage === "sPPomodoro" && (
        <SPPomodoro timelineData={timelineData} />
      )}
    </>
  );
}

export default Pomodoro;
