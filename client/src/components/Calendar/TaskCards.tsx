import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Calendar } from "lucide-react";
import { Task } from "./types/calendarType";

import { useTimeMachineStore } from "@/store/useTimeMachineStore";

type TaskCardsProps = {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
};

const TaskCards: React.FC<TaskCardsProps> = ({ tasks, onTaskClick }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const rightNow = useTimeMachineStore((state) => state.now);

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
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Prioritized by deadline</CardDescription>
            </div>
            <Badge variant="outline">{tasks.length} tasks</Badge>
          </div>

          <div>
            <label
              htmlFor="show-completed"
              className="flex items-center gap-1 text-sm cursor-pointer"
            >
              <Checkbox
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={() => setShowCompleted((prev) => !prev)}
              />
              Show completed
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="overflow-auto"
        style={{ maxHeight: "calc(75vh - 80px)" }}
      >
        {tasks
          .filter((task) => showCompleted || !task.isCompleted)
          .filter((task) => task.deadline).length === 0 ? (
          <div className="text-center text-muted-foreground my-4">
            No tasks to show!!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {tasks
              .filter((task) => showCompleted || !task.isCompleted)
              .map((task) => {
                if (!task.deadline) return null;

                const now = rightNow;
                const due = new Date(task.deadline);
                const diff = Math.ceil(
                  (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );

                let importance: "High" | "Medium" | "Low" = "Low";
                if (diff <= 1) importance = "High";
                else if (diff <= 3) importance = "Medium";

                const timeRemaining =
                  diff > 1
                    ? `${diff - 1} day${diff > 2 ? "s" : ""}`
                    : diff === 1
                    ? "Due soon"
                    : "Overdue!!!";

                return {
                  ...task,
                  importance,
                  timeRemaining,
                };
              })
              .filter(
                (
                  task
                ): task is Task & {
                  importance: "High" | "Medium" | "Low";
                  timeRemaining: string;
                } => task !== null
              )
              .map((task) => (
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
                          })}{" "}
                          at{" "}
                          {new Date(task.deadline).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCards;
