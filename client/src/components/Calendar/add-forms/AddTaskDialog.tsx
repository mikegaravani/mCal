import { useState, useEffect } from "react";
import { createTask, updateTask } from "../../../api/calendar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Folder } from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useTaskDialogStore } from "@/components/Calendar/store/useTaskDialogStore";

type AddTaskDialogProps = {
  onCreateSuccess?: () => void;
};

export default function AddTaskDialog({ onCreateSuccess }: AddTaskDialogProps) {
  const { isOpen, closeDialog, taskToEdit } = useTaskDialogStore();

  const isEditMode = !!taskToEdit;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadlineTime, setDeadlineTime] = useState<Date | null>(null);

  const [deadlineMissingError, setDeadlineMissingError] = useState("");

  useEffect(() => {
    if (taskToEdit && isOpen) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setDeadlineTime(
        taskToEdit.deadline ? new Date(taskToEdit.deadline) : null
      );
    }
  }, [taskToEdit, isOpen]);

  const handleSaveTask = async () => {
    let hasError = false;

    if (!deadlineTime) {
      setDeadlineMissingError("Deadline is required.");
      hasError = true;
    } else {
      setDeadlineMissingError("");
    }

    if (hasError) return;

    try {
      if (isEditMode && taskToEdit?.id) {
        await updateTask(taskToEdit.id, {
          title: title.trim() || "Unnamed Task",
          description,
          dueDate: deadlineTime!,
          isCompleted: taskToEdit.isCompleted,
        });
      } else {
        await createTask({
          title: title.trim() || "Unnamed Task",
          description,
          dueDate: deadlineTime!,
          isCompleted: false,
        });
      }

      setTitle("");
      setDescription("");
      setDeadlineTime(null);
      setDeadlineMissingError("");

      closeDialog();
      onCreateSuccess?.();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setTitle("");
          setDescription("");
          setDeadlineTime(null);
          setDeadlineMissingError("");
        }
        closeDialog();
      }}
    >
      <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-0 mt-4">
          <DialogTitle className="mb-1 p-0 text-2xl font-bold leading-tight">
            <Input
              className="bg-transparent p-1 border-none font-bold !text-3xl focus:outline-none focus:ring-0"
              placeholder="Unnamed Task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </DialogTitle>
          <DialogDescription className="p-0 text-sm text-gray-500">
            <Input
              className="bg-transparent p-1 border-b border-transparent focus:border-gray-300 w-full text-sm text-gray-500 focus:outline-none"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogDescription>
          <div className="mt-0 text-xs text-gray-500 flex items-center gap-2 w-full">
            <Folder className="w-4 h-4 text-gray-500" />
            <Input
              className="bg-transparent p-1 border-b border-transparent focus:border-gray-300 w-full text-xs text-gray-500 focus:outline-none"
              placeholder="Add category {TODO}"
            />
          </div>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-sm font-semibold mb-1">Deadline</Label>
              <DatePicker
                id="deadlineTime"
                selected={deadlineTime}
                onChange={(date) => {
                  setDeadlineTime(date);
                  if (date) setDeadlineMissingError("");
                }}
                selectsStart
                showTimeSelect={true}
                dateFormat={"MMMM do yyyy 'at' h:mm a"}
                placeholderText="Add deadline"
                wrapperClassName="w-full"
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "[caret-color:transparent]"
                )}
                popperClassName="max-h-[0px] mb-4"
                onKeyDown={(e) => e.preventDefault()}
              />
              {deadlineMissingError && (
                <p className="text-sm text-red-500 mt-1">
                  {deadlineMissingError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Other Options Section */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remind" />
            <Label htmlFor="remind" className="text-sm">
              Remind Me
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="participants" />
            <Label htmlFor="participants" className="text-sm">
              Add Participants
            </Label>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button className="w-full" onClick={handleSaveTask}>
            {isEditMode ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
