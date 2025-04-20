"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  AlarmClock,
} from "lucide-react";
import type { EventType } from "./mockEventGen";

type EventDialogProps = {
  event: EventType | null;
  onClose: () => void;
  getCategoryColor: (category: string) => { bg: string; color: string };
  onCompleteTask?: (eventId: string, completed: boolean) => void;
};

const EventDialog = ({
  event,
  onClose,
  getCategoryColor,
  onCompleteTask,
}: EventDialogProps) => {
  const [taskCompleted, setTaskCompleted] = useState(event?.completed || false);

  if (!event) return null;

  const isTask = event.category === "task";
  const categoryColor = getCategoryColor(event.category);

  const handleTaskComplete = () => {
    const newState = !taskCompleted;
    setTaskCompleted(newState);
    onCompleteTask?.(event.id, newState);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-lg">
        <div className="h-2" style={{ backgroundColor: categoryColor.bg }} />

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Badge className={`${categoryColor.bg} text-white mb-2`}>
                  {event.category.charAt(0).toUpperCase() +
                    event.category.slice(1)}
                </Badge>
                <DialogTitle className="text-2xl font-bold">
                  {event.title}
                </DialogTitle>
              </div>

              {isTask && (
                <div className="flex items-center justify-center">
                  <Checkbox
                    id="task-complete"
                    className="h-8 w-8 rounded-md border-2 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                    checked={taskCompleted}
                    onCheckedChange={handleTaskComplete}
                  />
                  <label htmlFor="task-complete" className="sr-only">
                    Complete task
                  </label>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(event.start)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {event.allDay ? (
                      "All day"
                    ) : (
                      <>
                        {formatTime(event.start)}
                        {event.end && ` - ${formatTime(event.end)}`}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {isTask && event.deadline && (
              <div className="flex items-center gap-2">
                <AlarmClock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">
                    {formatDate(event.deadline)} at {formatTime(event.deadline)}
                  </p>
                </div>
              </div>
            )}

            {event.description && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p>{event.description}</p>
                </div>
              </div>
            )}

            {isTask && taskCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-medium">Completed</p>
              </div>
            )}

            <Separator />

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </Button>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
