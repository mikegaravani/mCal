export interface EventType {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  category: "meeting" | "personal" | "task" | "holiday";
  description?: string;
}

export const generateMockEvents = (): EventType[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return [
    {
      id: "1",
      title: "Team Meeting",
      start: new Date(year, month, today.getDate(), 10, 0),
      end: new Date(year, month, today.getDate(), 11, 30),
      category: "meeting",
      description: "Weekly team sync with product and engineering",
    },
    {
      id: "2",
      title: "Project Review",
      start: new Date(year, month, today.getDate() + 1, 14, 0),
      end: new Date(year, month, today.getDate() + 1, 15, 30),
      category: "meeting",
      description: "Review project milestones and deliverables",
    },
    {
      id: "3",
      title: "Gym Session",
      start: new Date(year, month, today.getDate() - 1, 18, 0),
      end: new Date(year, month, today.getDate() - 1, 19, 30),
      category: "personal",
      description: "Cardio and strength training",
    },
    {
      id: "4",
      title: "Dentist Appointment",
      start: new Date(year, month, today.getDate() + 3, 9, 0),
      end: new Date(year, month, today.getDate() + 3, 10, 0),
      category: "personal",
      description: "Regular checkup",
    },
    {
      id: "5",
      title: "Complete Documentation",
      start: new Date(year, month, today.getDate() + 2),
      allDay: true,
      category: "task",
      description: "Finish API documentation for the new features",
    },
    {
      id: "6",
      title: "Code Review",
      start: new Date(year, month, today.getDate() - 2, 13, 0),
      end: new Date(year, month, today.getDate() - 2, 14, 30),
      category: "task",
      description: "Review pull requests for the frontend team",
    },
    {
      id: "7",
      title: "Company Holiday",
      start: new Date(year, month, today.getDate() + 5),
      allDay: true,
      category: "holiday",
      description: "Company-wide holiday",
    },
    {
      id: "8",
      title: "Product Launch",
      start: new Date(year, month, today.getDate() + 7),
      allDay: true,
      category: "meeting",
      description: "Launch of the new product version",
    },
    {
      id: "9",
      title: "Client Call",
      start: new Date(year, month, today.getDate() + 4, 11, 0),
      end: new Date(year, month, today.getDate() + 4, 12, 0),
      category: "meeting",
      description: "Discuss project requirements with the client",
    },
    {
      id: "10",
      title: "Deadline: Q3 Report",
      start: new Date(year, month, today.getDate() + 10),
      allDay: true,
      category: "task",
      description: "Submit quarterly report to management",
    },
    // Add some events in the next month
    {
      id: "11",
      title: "Annual Review",
      start: new Date(year, month + 1, 15),
      allDay: true,
      category: "meeting",
      description: "Annual performance review",
    },
    {
      id: "12",
      title: "Conference",
      start: new Date(year, month + 1, 20),
      end: new Date(year, month + 1, 22),
      allDay: true,
      category: "meeting",
      description: "Industry conference",
    },
    // Add some events in the previous month
    {
      id: "13",
      title: "Training Workshop",
      start: new Date(year, month - 1, 25),
      end: new Date(year, month - 1, 26),
      allDay: true,
      category: "personal",
      description: "Professional development workshop",
    },
    {
      id: "14",
      title: "Quarterly Planning",
      start: new Date(year, month - 1, 28),
      allDay: true,
      category: "meeting",
      description: "Quarterly planning session",
    },
  ];
};
