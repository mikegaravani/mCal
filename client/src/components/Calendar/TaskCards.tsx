import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { getTasks } from "@/api/calendar";
import { Task } from "./types/calendarType";

type TaskCardsProps = {
  onTaskClick?: (task: Task) => void;
};

const TaskCards: React.FC<TaskCardsProps> = ({ onTaskClick }) => {
  const [tasks, setTasks] = useState<
    (Task & {
      importance: "High" | "Medium" | "Low";
      timeRemaining: string;
    })[]
  >([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        const now = new Date();

        const formatted = res.data.map((t: any) => {
          if (!t.dueDate) return null;
          const due = new Date(t.dueDate);

          const diff = Math.ceil(
            (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          let importance: "High" | "Medium" | "Low" = "Low";

          if (diff <= 1) importance = "High";
          else if (diff <= 3) importance = "Medium";

          return {
            ...t,
            id: t._id,
            type: "task",
            deadline: t.dueDate,
            timeRemaining:
              diff > 0 ? `${diff} day${diff > 1 ? "s" : ""}` : "Due soon",
            importance,
          };
        });

        setTasks(formatted);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, []);

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
              onClick={() => onTaskClick?.(task)}
              className="cursor-pointer overflow-hidden transition-all hover:shadow-md p-0 gap-0"
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
                <div className="font-medium mb-2">{task.title}</div>
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
                  {task.deadline && (
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due:{" "}
                      {new Date(task.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
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
