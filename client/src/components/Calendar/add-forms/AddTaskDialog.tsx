import React, { useState } from "react";

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

import { useTaskDialogStore } from "@/store/useTaskDialogStore";

export default function AddTaskDialog() {
  const { isOpen, closeDialog } = useTaskDialogStore();

  const [deadlineTime, setDeadlineTime] = useState<Date | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-0 mt-4">
          <DialogTitle className="mb-1 p-0 text-2xl font-bold leading-tight">
            <Input
              className="bg-transparent p-1 border-none font-bold !text-3xl focus:outline-none focus:ring-0"
              placeholder="Unnamed Task"
            />
          </DialogTitle>
          {/* Editable Description */}
          <DialogDescription className="p-0 text-sm text-gray-500">
            <Input
              className="bg-transparent p-1 border-b border-transparent focus:border-gray-300 w-full text-sm text-gray-500 focus:outline-none"
              placeholder="Add description"
            />
          </DialogDescription>
          {/* Editable Location */}
          <div className="mt-0 text-xs text-gray-500 flex items-center gap-2 w-full">
            <Folder className="w-4 h-4 text-gray-500" /> {/* Pin icon */}
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
                onChange={(date) => setDeadlineTime(date)}
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
          <Button className="w-full" onClick={closeDialog}>
            Save Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
