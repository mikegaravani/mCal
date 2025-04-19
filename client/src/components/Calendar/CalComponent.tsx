import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/components/ui/card";
import { generateMockEvents, type EventType } from "./mockEventGen";
import FabMenu from "./FabMenu";
import TaskCards from "./TaskCards";
import EventDialog from "./EventDialog";

function CalComponent() {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [calendarApi, setCalendarApi] = useState<any>(null);
  const mockEvents = generateMockEvents();

  // Map categories to colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "meeting":
        return { bg: "bg-blue-500", color: "#3b82f6" }; // blue
      case "personal":
        return { bg: "bg-green-500", color: "#22c55e" }; // green
      case "task":
        return { bg: "bg-amber-500", color: "#f59e0b" }; // amber
      case "holiday":
        return { bg: "bg-red-500", color: "#ef4444" }; // red
      default:
        return { bg: "bg-gray-500", color: "#6b7280" }; // gray
    }
  };

  // Format events for FullCalendar
  const events = mockEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    extendedProps: {
      category: event.category,
      description: event.description,
    },
    backgroundColor: getCategoryColor(event.category).color,
    borderColor: getCategoryColor(event.category).color,
    textColor: "white",
  }));

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const event = mockEvents.find((e) => e.id === eventId) || null;
    setSelectedEvent(event);
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
                events={events}
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
        getCategoryColor={getCategoryColor}
      />
    </div>
  );
}

export default CalComponent;
