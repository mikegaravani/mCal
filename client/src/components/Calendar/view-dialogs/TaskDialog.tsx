import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2, CheckCircle2, AlarmClock } from "lucide-react";
import type { Task } from "../types/calendarType";
import { updateTask, deleteTask } from "@/api/calendar";
import { useTaskDialogStore } from "@/components/Calendar/store/useTaskDialogStore";
import AddTaskDialog from "../add-forms/AddTaskDialog";

type TaskDialogProps = {
  task: Task | null;
  onClose: () => void;
  getTypeColor: (type: "task") => { bg: string; color: string };
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  onDeleteSuccess?: (id: string) => void;
};

const TaskDialog: React.FC<TaskDialogProps> = ({
  task,
  onClose,
  getTypeColor,
  onUpdateTask,
  onDeleteSuccess,
}) => {
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { isOpen, openDialog, closeDialog } = useTaskDialogStore();

  useEffect(() => {
    if (task && typeof task.isCompleted === "boolean") {
      setTaskCompleted(task.isCompleted);
    }
  }, [task]);

  if (!task) return null;

  const typeColor = getTypeColor(task.type);

  const handleTaskComplete = async () => {
    const newState = !taskCompleted;
    setTaskCompleted(newState);

    try {
      await updateTask(task.id, { isCompleted: newState });
      onUpdateTask?.(task.id, { isCompleted: newState });
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Failed to update task:", error);
      setTaskCompleted(!newState);
    }
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

  const handleDeleteTask = async () => {
    if (!task) return;

    try {
      await deleteTask(task.id);
      onClose();
      onDeleteSuccess?.(task.id);
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <>
      <Dialog open={!!task} onOpenChange={onClose}>
        <DialogContent className="z-[9999] sm:max-w-[550px] p-0 overflow-hidden rounded-lg">
          <div className="h-2" style={{ backgroundColor: typeColor.bg }} />

          <div className="p-6">
            <DialogHeader className="mb-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <Badge className={`${typeColor.bg} text-white mb-2`}>
                    {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                  </Badge>
                  <DialogTitle className="text-2xl font-bold">
                    {task.title}
                  </DialogTitle>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Checkbox
                    id="task-complete"
                    className="h-8 w-8 rounded-md border-2 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                    checked={taskCompleted}
                    onCheckedChange={handleTaskComplete}
                  />
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Task completed</p>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <Separator />
              {task.deadline && (
                <div className="flex items-center gap-2">
                  <AlarmClock className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-medium">
                      {formatDate(task.deadline)} at {formatTime(task.deadline)}
                    </p>
                  </div>
                </div>
              )}

              {(task.description || taskCompleted) && <Separator />}

              {task.description && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Description</p>
                  <div className="p-3 bg-gray-100/50 rounded-lg">
                    <p>{task.description}</p>
                  </div>
                </div>
              )}

              {taskCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-medium">Completed</p>
                </div>
              )}

              <Separator />

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    onClose();
                    openDialog(task);
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isOpen && (
        <AddTaskDialog
          onCreateSuccess={() => {
            closeDialog();
            onClose();
          }}
        />
      )}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="z-[99999]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to permanently delete this task?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Yes, delete it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskDialog;
