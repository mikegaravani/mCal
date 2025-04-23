import { useState } from "react";
import { createEvent } from "../../../api/calendar"; // Adjust the import based on your API utility

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

import { MapPin } from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useEventDialogStore } from "@/store/useEventDialogStore";

export default function AddEventDialog() {
  const { isOpen, closeDialog } = useEventDialogStore();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isAllDay, setIsAllDay] = useState<boolean>(false);

  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const handleSaveEvent = async () => {
    let hasError = false;

    if (!startDate) {
      setStartDateError("Start date is required.");
      hasError = true;
    } else {
      setStartDateError("");
    }

    if (!endDate) {
      setEndDateError("End date is required.");
      hasError = true;
    } else {
      setEndDateError("");
    }

    const eventTitle = title.trim() === "" ? "Unnamed Event" : title;

    if (title.trim() === "") {
      setTitle("Unnamed Event");
    }

    if (hasError) return;

    const start = startDate!;
    const end = endDate!;

    try {
      await createEvent({
        title: eventTitle,
        description,
        location,
        startTime: start,
        endTime: end,
        isAllDay,
      });

      setTitle("");
      setDescription("");
      setLocation("");
      setStartDate(null);
      setEndDate(null);
      setIsAllDay(false);
      setStartDateError("");
      setEndDateError("");

      closeDialog();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setTitle("");
          setDescription("");
          setLocation("");
          setStartDate(null);
          setEndDate(null);
          setIsAllDay(false);
          setStartDateError("");
          setEndDateError("");
        }
        closeDialog();
      }}
    >
      <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-0 mt-4">
          <DialogTitle className="mb-1 p-0 text-2xl font-bold leading-tight">
            <Input
              className="bg-transparent p-1 border-none font-bold !text-3xl focus:outline-none focus:ring-0"
              placeholder="Unnamed Event"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </DialogTitle>
          {/* Editable Description */}
          <DialogDescription className="p-0 text-sm text-gray-500">
            <Input
              className="bg-transparent p-1 border-b border-transparent focus:border-gray-300 w-full text-sm text-gray-500 focus:outline-none"
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogDescription>
          {/* Editable Location */}
          <div className="mt-0 text-xs text-gray-500 flex items-center gap-2 w-full">
            <MapPin className="w-4 h-4 text-gray-500" /> {/* Pin icon */}
            <Input
              className="bg-transparent p-1 border-b border-transparent focus:border-gray-300 w-full text-xs text-gray-500 focus:outline-none"
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </DialogHeader>

        {/* Date/Time Section */}
        <div className="mt-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-sm font-semibold mb-1">Start</Label>
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  if (date) setStartDateError("");
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                showTimeSelect={!isAllDay}
                dateFormat={
                  isAllDay ? "MMMM do yyyy" : "MMMM do yyyy 'at' h:mm a"
                }
                placeholderText=""
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
              {startDateError && (
                <p className="text-sm text-red-500 mt-1">{startDateError}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold mb-1">End</Label>
              <DatePicker
                id="endDate"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                showTimeSelect={!isAllDay}
                dateFormat={
                  isAllDay ? "MMMM do yyyy" : "MMMM do yyyy 'at' h:mm a"
                }
                placeholderText=""
                wrapperClassName="w-full"
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "[caret-color:transparent]"
                )}
                onKeyDown={(e) => e.preventDefault()}
              />
              {endDateError && (
                <p className="text-sm text-red-500 mt-1">{endDateError}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="all-day"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
              />
              <Label htmlFor="all-day" className="text-sm">
                All Day
              </Label>
            </div>
          </div>
        </div>

        {/* Other Options Section */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="repeat" />
            <Label htmlFor="repeat" className="text-sm">
              Repeat
            </Label>
          </div>
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
          <div className="flex items-center gap-2">
            <input type="checkbox" id="resources" />
            <Label htmlFor="resources" className="text-sm">
              Add Resources
            </Label>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <Button className="w-full" onClick={handleSaveEvent}>
            Save Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
