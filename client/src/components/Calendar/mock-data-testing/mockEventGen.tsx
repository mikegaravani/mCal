import { Event, Task } from "../types/calendarType";

export const generateMockEvents = (): Event[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return [
    {
      id: "e1",
      title: "Team Sync",
      startTime: new Date(year, month, today.getDate(), 10, 0),
      endTime: new Date(year, month, today.getDate(), 11, 30),
      type: "event",
      location: "Zoom",
      description: "Weekly team sync with product and engineering",
    },
    {
      id: "e2",
      title: "Project Review",
      startTime: new Date(year, month, today.getDate() + 1, 14, 0),
      endTime: new Date(year, month, today.getDate() + 1, 15, 30),
      type: "event",
      description: "Review project milestones and deliverables",
    },
    {
      id: "e3",
      title: "Dentist Appointment",
      startTime: new Date(year, month, today.getDate() + 3, 9, 0),
      endTime: new Date(year, month, today.getDate() + 4, 10, 0),
      type: "event",
      location: "Dental Clinic",
      description: "Regular checkup",
    },
    {
      id: "e4",
      title: "Boom",
      startTime: new Date(year, month, today.getDate() + 4),
      endTime: new Date(year, month, today.getDate() + 6),
      isAllDay: true,
      type: "event",
      location: "yooooo",
      description: "works?",
    },
  ];
};

export const generateMockTasks = (): Task[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return [
    {
      id: "t1",
      title: "Complete Documentation",
      deadline: new Date(year, month, today.getDate() + 2),
      type: "task",
      isCompleted: false,
      description: "Finish API documentation for the new features",
    },
    {
      id: "t2",
      title: "Deadline: Q3 Report",
      deadline: new Date(year, month, today.getDate() + 10),
      isCompleted: true,
      type: "task",
      description: "Submit quarterly report to management",
    },
  ];
};
