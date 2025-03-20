import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateMockEvents, EventType } from "./mockEventGen";
import FabMenu from "./FabMenu";
import TaskTable from "./TaskTable";

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>
                Types of events in your calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Meetings</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Personal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Tasks</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Holidays</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedEvent ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedEvent.title}</CardTitle>
                <CardDescription>
                  <Badge
                    className={`${
                      getCategoryColor(selectedEvent.category).bg
                    } text-white`}
                  >
                    {selectedEvent.category.charAt(0).toUpperCase() +
                      selectedEvent.category.slice(1)}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Time: </span>
                    {selectedEvent.allDay
                      ? "All day"
                      : `${new Date(selectedEvent.start).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )} - 
                      ${
                        selectedEvent.end
                          ? new Date(selectedEvent.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""
                      }`}
                  </div>
                  <div>
                    <span className="font-medium">Date: </span>
                    {new Date(selectedEvent.start).toLocaleDateString()}
                  </div>
                  {selectedEvent.description && (
                    <div>
                      <span className="font-medium">Description: </span>
                      {selectedEvent.description}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>
                  Click on an event to see details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No event selected</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TaskTable />
    </div>
  );
}

export default CalComponent;
