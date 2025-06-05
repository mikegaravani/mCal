import { useState, useEffect } from "react";
import CalComponent from "./CalComponent";
import AddEventDialog from "./add-forms/AddEventDialog";
import AddTaskDialog from "./add-forms/AddTaskDialog";
import AddStudyPlanDialog from "./add-forms/AddStudyPlanDialog";
import { getExpandedEvents, getTasks, getStudyPlans } from "@/api/calendar";
import { Event, Task, StudyPlan } from "./types/calendarType";

import { useTimeMachineStore } from "@/store/useTimeMachineStore";

function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  const [visibleRange, setVisibleRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const now = useTimeMachineStore((state) => state.now);

  const fetchData = async (range?: { start: Date; end: Date }) => {
    try {
      const { start, end } = range ?? {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth() + 2, 0),
      };

      const [eventRes, taskRes, studyRes] = await Promise.all([
        getExpandedEvents(start, end),
        getTasks(),
        getStudyPlans(),
      ]);

      const fetchedEvents = eventRes.data.map((occ: any) => ({
        ...occ,

        // UNIQUE ID for the single event occurrence (needed for FullCalendar)
        id: `${occ.id}_${new Date(occ.startTime).getTime()}`,

        // ID for the event series (same for all occurrence instances)
        seriesId: occ.id,

        type: "event",
      }));

      const fetchedTasks = taskRes.data.map((t: any) => ({
        ...t,
        id: t._id,
        type: "task",
        deadline: t.dueDate,
      }));

      const fetchedStudyPlans = studyRes.data.map((s: any) => ({
        ...s,
        id: s._id,
        type: "study-plan",
        start: s.date,
      }));

      setEvents(fetchedEvents);
      setTasks(fetchedTasks);
      setStudyPlans(fetchedStudyPlans);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="p-6">
        <CalComponent
          events={events}
          tasks={tasks}
          studyPlans={studyPlans}
          setEvents={setEvents}
          setTasks={setTasks}
          setStudyPlans={setStudyPlans}
          onDateRangeChange={(start, end) => {
            setVisibleRange({ start, end });
            fetchData({ start, end });
          }}
        />
        <AddEventDialog
          onCreateSuccess={() => {
            if (visibleRange) {
              fetchData(visibleRange);
            } else {
              fetchData();
            }
          }}
        />
        <AddTaskDialog
          onCreateSuccess={() => {
            if (visibleRange) {
              fetchData(visibleRange);
            } else {
              fetchData();
            }
          }}
        />
        <AddStudyPlanDialog
          onCreateSuccess={() => {
            if (visibleRange) {
              fetchData(visibleRange);
            } else {
              fetchData();
            }
          }}
        />
      </div>
    </>
  );
}

export default Calendar;
