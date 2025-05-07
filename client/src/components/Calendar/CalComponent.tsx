import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/components/ui/card";

import { Event, Task } from "./types/calendarType";
import { useFormattedCalendarItems } from "./hooks/useFormattedCalendarItems";

import FabMenu from "./add-forms/FabMenu";
import TaskCards from "./TaskCards";
import EventDialog from "./view-dialogs/EventDialog";
import TaskDialog from "./view-dialogs/TaskDialog";

import { useTimeMachineStore } from "@/store/useTimeMachineStore";

type CalComponentProps = {
  events: Event[];
  tasks: Task[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onDateRangeChange: (start: Date, end: Date) => void;
};

function CalComponent({
  events,
  tasks,
  setEvents,
  setTasks,
  onDateRangeChange,
}: CalComponentProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [calendarApi, setCalendarApi] = useState<any>(null);

  const [calendarKey, setCalendarKey] = useState<string>("init");
  const isReady = useTimeMachineStore((state) => state.isReady);

  const calendarItems = useFormattedCalendarItems(events, tasks);

  const rightNow = useTimeMachineStore((state) => state.now);
  const justModified = useTimeMachineStore((state) => state.justModified);
  const setJustModified = useTimeMachineStore((state) => state.setJustModified);

  const handleDatesSet = (arg: any) => {
    const start = new Date(arg.start);
    const end = new Date(arg.end);
    onDateRangeChange(start, end);
  };

  useEffect(() => {
    if (isReady && !calendarKey && rightNow) {
      setCalendarKey(rightNow.toISOString());
    }
    if (calendarApi && rightNow && justModified) {
      calendarApi.gotoDate(rightNow);
      calendarApi.setOption("now", rightNow);
      setCalendarKey(rightNow.toISOString());
      setJustModified(false);
    }
  }, [
    calendarApi,
    rightNow,
    justModified,
    setJustModified,
    calendarKey,
    isReady,
  ]);

  const getTypeColor = (type: "event" | "task" | "birthday") => {
    switch (type) {
      case "event":
        return { bg: "bg-blue-500", color: "#3b82f6" };
      case "task":
        return { bg: "bg-amber-500", color: "#f59e0b" };
      case "birthday":
        return { bg: "bg-green-500", color: "#22c55e" };
      default:
        return { bg: "bg-gray-500", color: "#6b7280" };
    }
  };

  const updateTaskInState = (taskId: string, updatedFields: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updatedFields } : t))
    );
  };

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const ev = events.find((e) => e.id === eventId);
    const ta = tasks.find((t) => t.id === eventId);

    if (ev?.type === "event") {
      setSelectedEvent(ev);
      return;
    }
    if (ta?.type === "task") {
      setSelectedTask(ta);
    }
  };

  // Switch to list view
  const switchToListView = () => {
    if (calendarApi) {
      calendarApi.changeView("listWeek");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <FabMenu />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="px-3">
              {isReady && calendarKey && (
                <FullCalendar
                  key={calendarKey}
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                  ]}
                  initialView="dayGridMonth"
                  initialDate={rightNow}
                  nowIndicator={false}
                  now={rightNow}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,listBtn",
                  }}
                  customButtons={{
                    listBtn: {
                      text: "List",
                      click: switchToListView,
                    },
                  }}
                  buttonText={{
                    today: "Today",
                    month: "Month",
                    week: "Week",
                  }}
                  events={calendarItems}
                  datesSet={handleDatesSet}
                  contentHeight={500}
                  height={"75vh"}
                  eventClick={handleEventClick}
                  dayMaxEvents={3}
                  weekends={true}
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    meridiem: "short",
                  }}
                  ref={(el) => {
                    if (el) {
                      setCalendarApi(el.getApi());
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="h-full">
          <TaskCards
            tasks={tasks}
            onTaskClick={(task) => setSelectedTask(task)}
          />
        </div>
      </div>

      <EventDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDeleteSuccess={(eventId) => {
          setEvents((prev) => prev.filter((e) => e.id !== eventId));
          setSelectedEvent(null);
        }}
        getTypeColor={getTypeColor}
      />

      <TaskDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        getTypeColor={getTypeColor}
        onUpdateTask={updateTaskInState}
        onDeleteSuccess={(taskId) => {
          setTasks((prev) => prev.filter((e) => e.id !== taskId));
          setSelectedTask(null);
        }}
      />
    </div>
  );
}

export default CalComponent;
