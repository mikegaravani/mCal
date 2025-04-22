import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { Task } from "./types/calendarType";

type TaskCardsProps = {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
};

const TaskCards: React.FC<TaskCardsProps> = ({ tasks, onTaskClick }) => {
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
          {tasks
            .map((task) => {
              if (!task.deadline) return null;

              const now = new Date();
              const due = new Date(task.deadline);
              const diff = Math.ceil(
                (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );

              let importance: "High" | "Medium" | "Low" = "Low";
              if (diff <= 1) importance = "High";
              else if (diff <= 3) importance = "Medium";

              const timeRemaining =
                diff > 0 ? `${diff} day${diff > 1 ? "s" : ""}` : "Due soon";

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
