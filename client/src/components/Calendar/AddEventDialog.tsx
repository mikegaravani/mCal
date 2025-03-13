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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useEventDialogStore } from "@/store/useEventDialogStore";

export default function AddEventDialog() {
  const { isOpen, closeDialog } = useEventDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-left">
        <DialogHeader className="p-0 my-4">
          <DialogTitle className="mb-1 p-0 text-2xl font-bold leading-tight">
            <Input
              className="bg-transparent p-1 border-none font-bold !text-3xl focus:outline-none focus:ring-0"
              placeholder="Unnamed Event"
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
          <div className="mt-0 text-xs text-gray-500">
            <Input
              className="bg-transparent p-1 border-b border-transparent focus:border-gray-300 w-full text-xs text-gray-500 focus:outline-none"
              placeholder="Add location"
            />
          </div>
        </DialogHeader>

        {/* Date/Time Section */}
        <div className="mt-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-sm font-semibold">Start</Label>
              {/* Replace these Inputs with DatePicker if desired */}
              {/* <DatePicker
                placeholderText="Select start date/time"
                onChange={() => {}}
              /> */}
              <Input className="mt-1" placeholder="Start date/time" />
            </div>
            <div>
              <Label className="text-sm font-semibold">End</Label>
              {/* <DatePicker
                placeholderText="Select end date/time"
                onChange={() => {}}
              /> */}
              <Input className="mt-1" placeholder="End date/time" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="all-day" />
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
          <Button className="w-full" onClick={closeDialog}>
            Save Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
