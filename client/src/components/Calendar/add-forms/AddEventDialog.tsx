import { useState, useEffect } from "react";
import { createEvent, updateEvent } from "../../../api/calendar";

import { Recurrence } from "../types/recurrence";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { MapPin } from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useEventDialogStore } from "@/components/Calendar/store/useEventDialogStore";
import { useTimeMachineStore } from "@/store/useTimeMachineStore";

import RepeatDialog from "../repeat/RepeatDialog";
import RemindMeDialog from "../remind-me/RemindMeDialog";
import { RemindOptions, Notify } from "../types/reminders";
import { buildNotifyFromRemindOptions } from "../remind-me/buildNotify";

type AddEventDialogProps = {
  onCreateSuccess?: () => void;
};

export default function AddEventDialog({
  onCreateSuccess,
}: AddEventDialogProps) {
  const { isOpen, closeDialog, eventToEdit } = useEventDialogStore();
  const isEditMode = !!eventToEdit;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isAllDay, setIsAllDay] = useState<boolean>(false);

  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const now = useTimeMachineStore((state) => state.now);

  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);

  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatSummary, setRepeatSummary] = useState("");

  const [recurrence, setRecurrence] = useState<Recurrence | undefined>();

  const [remindDialogOpen, setRemindDialogOpen] = useState(false);

  const [remindEnabled, setRemindEnabled] = useState(false);
  const [remindSummary, setRemindSummary] = useState("");

  const [remindData, setRemindData] = useState<RemindOptions | undefined>();
  const [remindParsedData, setRemindParsedData] = useState<
    Notify | undefined
  >();
  const [isReminderLocked, setIsReminderLocked] = useState(false);

  useEffect(() => {
    if (eventToEdit && isOpen) {
      setTitle(eventToEdit.title || "");
      setDescription(eventToEdit.description || "");
      setLocation(eventToEdit.location || "");
      setStartDate(new Date(eventToEdit.startTime));
      setEndDate(new Date(eventToEdit.endTime));
      setIsAllDay(eventToEdit.isAllDay || false);

      if (eventToEdit.recurrence && eventToEdit.recurrence.frequency) {
        setRecurrence(eventToEdit.recurrence);
        setRepeatEnabled(true);
        setRepeatSummary("Edit existing recurrence");
      } else {
        setRecurrence(undefined);
        setRepeatEnabled(false);
        setRepeatSummary("");
      }

      if (eventToEdit.notify && eventToEdit.notify.enabled) {
        setRemindEnabled(true);
        setRemindParsedData(eventToEdit.notify);
        setRemindSummary("");
        setIsReminderLocked(true);
      } else {
        setRemindEnabled(false);
        setRemindData(undefined);
        setRemindSummary("");
        setIsReminderLocked(false);
      }
    } else {
      setTitle("");
      setDescription("");
      setLocation("");
      setStartDate(null);
      setEndDate(null);
      setIsAllDay(false);
      setStartDateError("");
      setEndDateError("");

      setRepeatEnabled(false);
      setRecurrence(undefined);
      setRepeatSummary("");

      setRemindEnabled(false);
      setRemindData(undefined);
      setRemindSummary("");
    }
  }, [eventToEdit, isOpen]);

  useEffect(() => {
    if (!repeatDialogOpen && repeatEnabled && repeatSummary === "") {
      setRepeatEnabled(false);
      setRecurrence(undefined);
    }
  }, [repeatDialogOpen, repeatEnabled, repeatSummary]);

  const handleRepeatSave = (recurrenceData: Recurrence) => {
    setRepeatEnabled(true);
    setRecurrence(recurrenceData);

    setRepeatSummary("Custom recurrence set");
  };

  const handleRemindSave = (options: RemindOptions) => {
    setRemindEnabled(true);
    setRemindData(options);

    setRemindSummary("Custom remind set");
  };

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

    if (hasError) return;

    const notify = remindEnabled
      ? remindData && startDate
        ? buildNotifyFromRemindOptions(remindData, startDate)
        : remindParsedData
      : isEditMode
      ? null
      : undefined;

    const eventPayload = {
      title: title.trim() || "Unnamed Event",
      description,
      location,
      startTime: startDate!,
      endTime: endDate!,
      isAllDay,
      ...(repeatEnabled && recurrence?.frequency
        ? { recurrence }
        : isEditMode
        ? { recurrence: null }
        : {}),
      ...(notify !== undefined ? { notify } : {}),
    };

    try {
      if (isEditMode && eventToEdit?.seriesId) {
        await updateEvent(eventToEdit.seriesId, eventPayload);
      } else {
        await createEvent(eventPayload);
      }

      setTitle("");
      setDescription("");
      setLocation("");
      setStartDate(null);
      setEndDate(null);
      setIsAllDay(false);
      setStartDateError("");
      setEndDateError("");

      closeDialog();
      onCreateSuccess?.();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <>
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
        <DialogContent className="z-[9997] bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-left max-h-[90vh] overflow-y-auto">
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
            <div className="p-0 text-sm text-gray-500">
              <Input
                className="bg-transparent p-1 border-b border-transparent focus:border-gray-300 w-full text-sm text-gray-500 focus:outline-none"
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
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
                  timeIntervals={5}
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
                  openToDate={now}
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
                  onChange={(date) => {
                    setEndDate(date);
                    if (date) setEndDateError("");
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  showTimeSelect={!isAllDay}
                  timeIntervals={5}
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
              <input
                type="checkbox"
                id="repeat"
                checked={repeatEnabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  setRepeatEnabled(enabled);
                  if (enabled) {
                    setRepeatDialogOpen(true);
                  } else {
                    setRecurrence(undefined);
                    setRepeatSummary("");
                  }
                }}
              />
              <Label htmlFor="repeat" className="text-sm">
                Repeat
              </Label>
              {repeatEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-500 hover:text-blue-700 p-0 h-auto ml-2"
                  onClick={() => setRepeatDialogOpen(true)}
                >
                  {repeatSummary}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remind"
                checked={remindEnabled}
                onChange={(e) => {
                  const checked = e.target.checked;

                  if (!checked) {
                    setRemindEnabled(false);
                    setRemindData(undefined);
                    setRemindSummary("");
                    setIsReminderLocked(false);
                  } else {
                    if (!isReminderLocked) {
                      setRemindDialogOpen(true);
                    }
                  }
                }}
              />
              <Label htmlFor="remind" className="text-sm">
                Remind Me
              </Label>
              {remindEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-500 hover:text-blue-700 p-0 h-auto ml-2"
                  onClick={() => {
                    if (!isReminderLocked) {
                      setRemindDialogOpen(true);
                    }
                  }}
                >
                  {remindSummary}
                </Button>
              )}
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
              {isEditMode ? "Update Event" : "Save Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <RepeatDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        onSave={handleRepeatSave}
      />

      <RemindMeDialog
        open={remindDialogOpen}
        onOpenChange={setRemindDialogOpen}
        onSave={handleRemindSave}
      />
    </>
  );
}
