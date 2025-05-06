import { useState, useEffect } from "react";
import CalComponent from "./CalComponent";
import AddEventDialog from "./add-forms/AddEventDialog";
import AddTaskDialog from "./add-forms/AddTaskDialog";
import { getEvents, getExpandedEvents, getTasks } from "@/api/calendar";
import { Event, Task } from "./types/calendarType";

import { useTimeMachineStore } from "@/store/useTimeMachineStore";

function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const now = useTimeMachineStore((state) => state.now);

  const fetchData = async () => {
    try {
      const fetchStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const fetchEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

      const [eventRes, taskRes] = await Promise.all([
        getExpandedEvents(fetchStart, fetchEnd),
        // getEvents(),
        getTasks(),
      ]);

      const fetchedEvents = eventRes.data.map((e: any) => ({
        ...e,
        id: e._id,
        type: "event",
      }));

      const fetchedTasks = taskRes.data.map((t: any) => ({
        ...t,
        id: t._id,
        type: "task",
        deadline: t.dueDate,
      }));

      setEvents(fetchedEvents);
      setTasks(fetchedTasks);
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
          setEvents={setEvents}
          setTasks={setTasks}
        />
        <AddEventDialog onCreateSuccess={fetchData} />
        <AddTaskDialog onCreateSuccess={fetchData} />
      </div>
    </>
  );
}

export default Calendar;
