import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

const tasks = [
  {
    id: 1,
    name: "Complete project report",
    importance: "High",
    timeRemaining: "2 days",
    dueDate: "2025-04-20",
  },
  {
    id: 2,
    name: "Fix UI bugs",
    importance: "Medium",
    timeRemaining: "5 days",
    dueDate: "2025-04-23",
  },
  {
    id: 3,
    name: "Prepare presentation",
    importance: "High",
    timeRemaining: "1 day",
    dueDate: "2025-04-19",
  },
  {
    id: 4,
    name: "Update documentation",
    importance: "Low",
    timeRemaining: "7 days",
    dueDate: "2025-04-25",
  },
  {
    id: 5,
    name: "Update documentation",
    importance: "Low",
    timeRemaining: "7 days",
    dueDate: "2025-04-25",
  },
  {
    id: 6,
    name: "Update documentation",
    importance: "Low",
    timeRemaining: "7 days",
    dueDate: "2025-04-25",
  },
  {
    id: 7,
    name: "Update documentation",
    importance: "Low",
    timeRemaining: "7 days",
    dueDate: "2025-04-25",
  },
];

const TaskCards = () => {
  const getImportanceVariant = (importance: string) => {
    switch (importance) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Prioritized by deadline</CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            {tasks.length} tasks
          </Badge>
        </div>
      </CardHeader>
      <CardContent
        className="overflow-auto"
        style={{ maxHeight: "calc(75vh - 80px)" }}
      >
        <div className="grid grid-cols-1 gap-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="overflow-hidden transition-all hover:shadow-md p-0 gap-0"
            >
              <div
                className={`h-1 w-full ${
                  task.importance === "High"
                    ? "bg-red-500"
                    : task.importance === "Medium"
                    ? "bg-blue-500"
                    : "bg-slate-300"
                }`}
              />
              <div className="p-3">
                <div className="font-medium mb-2">{task.name}</div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <Badge variant={getImportanceVariant(task.importance)}>
                      {task.importance}
                    </Badge>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.timeRemaining}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Due:{" "}
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCards;
