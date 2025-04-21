import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/components/ui/card";

import { generateMockEvents, generateMockTasks } from "./mockEventGen";
import { CalendarItem, Event, Task } from "./types/calendarType";

import FabMenu from "./add-forms/FabMenu";
import TaskCards from "./TaskCards";
import EventDialog from "./view-dialogs/EventDialog";
import TaskDialog from "./view-dialogs/TaskDialog";

function CalComponent() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [calendarApi, setCalendarApi] = useState<any>(null);

  const mockEvents = generateMockEvents();
  const mockTasks = generateMockTasks();

  const allItems: CalendarItem[] = [...mockEvents, ...mockTasks];

  const getTypeColor = (type: "event" | "task") => {
    switch (type) {
      case "event":
        return { bg: "bg-blue-500", color: "#3b82f6" }; // blue
      case "task":
        return { bg: "bg-amber-500", color: "#f59e0b" }; // amber
      default:
        return { bg: "bg-gray-500", color: "#6b7280" }; // gray
    }
  };

  // Formatting for FullCalendar
  const calendarItems = allItems.map((item) => {
    let start: Date | string | undefined;
    let end: Date | string | undefined;

    if (item.type === "event") {
      const event = item as Event;
      start = event.startTime;
      end = event.endTime;
    } else {
      const task = item as Task;
      start = task.deadline;
      end = undefined;
    }

    return {
      id: item.id,
      title: item.title,
      start,
      end,
      allDay: item.type === "event" ? (item as Event).isAllDay ?? false : true,
      extendedProps: {
        type: item.type,
        description: item.description,
      },
      backgroundColor: getTypeColor(item.type).color,
      borderColor: getTypeColor(item.type).color,
      textColor: "white",
    };
  });

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const ev = mockEvents.find((e) => e.id === eventId);
    const ta = mockTasks.find((t) => t.id === eventId);

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
          <TaskCards />
        </div>
      </div>

      <EventDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        getTypeColor={getTypeColor}
      />

      {/* <TaskDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        getTypeColor={getTypeColor}
      /> */}
    </div>
  );
}

export default CalComponent;
