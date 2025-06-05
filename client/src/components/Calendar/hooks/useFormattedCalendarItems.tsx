import {
  CalendarItem,
  Event,
  Task,
  StudyPlan,
} from "@/components/Calendar/types/calendarType";
import { getTypeColor } from "@/components/Calendar/hooks/calendarColors";

export function useFormattedCalendarItems(
  events: Event[],
  tasks: Task[],
  studyPlans: StudyPlan[]
) {
  const allItems: CalendarItem[] = [...events, ...tasks, ...studyPlans];

  return allItems.map((item) => {
    const start =
      item.type === "event"
        ? (item as Event).startTime
        : item.type === "study-plan"
        ? (item as StudyPlan).date
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
