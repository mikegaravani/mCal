import { useState, useEffect } from "react";
import { Calendar, Clock, RotateCcw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useStudyPlanDialogStore } from "../store/useStudyPlanDialogStore";

type CreateStudySessionDialogProps = {
  onCreateSuccess?: () => void;
};

export default function CreateStudySessionDialog({
  onCreateSuccess,
}: CreateStudySessionDialogProps) {
  const { isOpen, closeDialog: onClose } = useStudyPlanDialogStore();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [focusTime, setFocusTime] = useState<string>("");
  const [breakTime, setBreakTime] = useState<string>("");
  const [cycles, setCycles] = useState<string>("");
  const [dragToNextDay, setDragToNextDay] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [dateError, setDateError] = useState("");
  const [focusTimeError, setFocusTimeError] = useState("");
  const [breakTimeError, setBreakTimeError] = useState("");
  const [cyclesError, setCyclesError] = useState("");

  // Focus time options (in minutes)
  const focusTimeOptions = [
    { value: "15", label: "15 minutes" },
    { value: "25", label: "25 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  // Break time options (in minutes)
  const breakTimeOptions = [
    { value: "5", label: "5 minutes" },
    { value: "10", label: "10 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "20", label: "20 minutes" },
    { value: "30", label: "30 minutes" },
  ];

  useEffect(() => {
    if (!isOpen) {
      // Reset form when dialog closes
      setTitle("");
      setDescription("");
      setSelectedDate(undefined);
      setFocusTime("");
      setBreakTime("");
      setCycles("");
      setDragToNextDay(false);
      setDateError("");
      setFocusTimeError("");
      setBreakTimeError("");
      setCyclesError("");
    }
  }, [isOpen]);

  const handleSaveSession = async () => {
    let hasError = false;

    // Validation
    if (!selectedDate) {
      setDateError("Date is required.");
      hasError = true;
    } else {
      setDateError("");
    }

    if (!focusTime) {
      setFocusTimeError("Focus time is required.");
      hasError = true;
    } else {
      setFocusTimeError("");
    }

    if (!breakTime) {
      setBreakTimeError("Break time is required.");
      hasError = true;
    } else {
      setBreakTimeError("");
    }

    if (!cycles || Number.parseInt(cycles) < 1) {
      setCyclesError("Number of cycles must be at least 1.");
      hasError = true;
    } else {
      setCyclesError("");
    }

    if (hasError) return;

    // Here you would typically save the study session
    const sessionPayload = {
      title: title.trim() || "Study Session",
      description,
      date: selectedDate,
      focusTime: Number.parseInt(focusTime),
      breakTime: Number.parseInt(breakTime),
      cycles: Number.parseInt(cycles),
      dragToNextDay,
    };

    try {
      // Simulate API call
      console.log("Creating study session:", sessionPayload);

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedDate(undefined);
      setFocusTime("");
      setBreakTime("");
      setCycles("");
      setDragToNextDay(false);

      onClose();
      onCreateSuccess?.();
    } catch (err) {
      console.error("Error creating study session:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[9997] bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-0 mt-4">
          <DialogTitle className="mb-1 p-0 text-2xl font-bold leading-tight">
            <Input
              className="bg-transparent p-1 border-none font-bold !text-3xl focus:outline-none focus:ring-0"
              placeholder="Study Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </DialogTitle>
          {/* Editable Description */}
          <div className="p-0 text-sm text-gray-500">
            <Input
              className="bg-transparent p-1 border-b border-transparent focus:border-gray-300 w-full text-sm text-gray-500 focus:outline-none"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </DialogHeader>

        {/* Date Selection */}
        <div className="mt-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-sm font-semibold mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate ? (
                      format(selectedDate, "MMMM do, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                      if (date) setDateError("");
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateError && (
                <p className="text-sm text-red-500 mt-1">{dateError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Study Cycle Configuration */}
        <div className="mt-6">
          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-sm font-semibold mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Focus Time
              </Label>
              <Select
                value={focusTime}
                onValueChange={(value) => {
                  setFocusTime(value);
                  if (value) setFocusTimeError("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select focus duration" />
                </SelectTrigger>
                <SelectContent>
                  {focusTimeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {focusTimeError && (
                <p className="text-sm text-red-500 mt-1">{focusTimeError}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold mb-1 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Break Time
              </Label>
              <Select
                value={breakTime}
                onValueChange={(value) => {
                  setBreakTime(value);
                  if (value) setBreakTimeError("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select break duration" />
                </SelectTrigger>
                <SelectContent>
                  {breakTimeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {breakTimeError && (
                <p className="text-sm text-red-500 mt-1">{breakTimeError}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cycles" className="text-sm font-semibold mb-1">
                Number of Cycles
              </Label>
              <Input
                id="cycles"
                type="number"
                min="1"
                max="20"
                placeholder="e.g., 4"
                value={cycles}
                onChange={(e) => {
                  setCycles(e.target.value);
                  if (e.target.value && Number.parseInt(e.target.value) >= 1) {
                    setCyclesError("");
                  }
                }}
                className="w-full"
              />
              {cyclesError && (
                <p className="text-sm text-red-500 mt-1">{cyclesError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Options Section */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="drag-to-next-day"
              checked={dragToNextDay}
              onChange={(e) => setDragToNextDay(e.target.checked)}
            />
            <Label htmlFor="drag-to-next-day" className="text-sm">
              Drag to next day if not completed
            </Label>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button className="w-full" onClick={handleSaveSession}>
            Create Study Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
