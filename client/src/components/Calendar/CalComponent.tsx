import { useState } from "react";
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

type CalComponentProps = {
  events: Event[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

function CalComponent({ events, tasks, setTasks }: CalComponentProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [calendarApi, setCalendarApi] = useState<any>(null);

  const calendarItems = useFormattedCalendarItems(events, tasks);

  const getTypeColor = (type: "event" | "task") => {
    switch (type) {
      case "event":
        return { bg: "bg-blue-500", color: "#3b82f6" };
      case "task":
        return { bg: "bg-amber-500", color: "#f59e0b" };
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
              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  listPlugin,
                  interactionPlugin,
                ]}
                initialView="dayGridMonth"
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
                contentHeight={500}
                height={"75vh"}
                eventClick={handleEventClick}
                dayMaxEvents={3}
                nowIndicator={true}
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
        getTypeColor={getTypeColor}
      />

      <TaskDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        getTypeColor={getTypeColor}
        onUpdateTask={updateTaskInState}
      />
    </div>
  );
}

export default CalComponent;
