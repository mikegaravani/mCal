import {
  CalendarItem,
  Event,
  Task,
} from "@/components/Calendar/types/calendarType";

export function useFormattedCalendarItems(events: Event[], tasks: Task[]) {
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

  const allItems: CalendarItem[] = [...events, ...tasks];

  return allItems.map((item) => {
    const start =
      item.type === "event"
        ? (item as Event).startTime
        : (item as Task).deadline;
    const end = item.type === "event" ? (item as Event).endTime : undefined;

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
}
