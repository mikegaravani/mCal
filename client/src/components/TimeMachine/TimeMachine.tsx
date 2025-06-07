// Note: Time Machine syncing from the backend is in src/components/Layout/Layout.tsx

import { useState } from "react";
import { timeMachineApi } from "@/api/timeMachine";
import { useTimeMachineStore } from "@/store/useTimeMachineStore";

import { Clock3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TimeMachine() {
  const {
    now: currentDate,
    isModified,
    setJustModified,
    syncTimeFromBackend,
    resetTime: resetTimeStore,
  } = useTimeMachineStore();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hours, setHours] = useState<number>(currentDate.getHours());
  const [minutes, setMinutes] = useState<number>(currentDate.getMinutes());
  const [seconds, setSeconds] = useState<number>(currentDate.getSeconds());

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const REQUIRED_PASSWORD = "secret123";

  const handleApplyTimeChange = async (date: Date) => {
    try {
      await timeMachineApi.setCustomTime(date);
      await syncTimeFromBackend();
      setJustModified(true);
    } catch (error) {
      console.error("Failed to set custom time:", error);
    }
  };

  const handleResetTime = async () => {
    try {
      await timeMachineApi.resetTime();
      resetTimeStore();
    } catch (error) {
      console.error("Failed to reset time:", error);
    }
  };

  const handleApplyClick = () => {
    const baseDate = selectedDate ?? currentDate;

    const builtDate = new Date(baseDate);
    builtDate.setHours(hours);
    builtDate.setMinutes(minutes);
    builtDate.setSeconds(seconds);

    handleApplyTimeChange(builtDate);
  };

  const addTimeToSelectedDate = (
    amount: number,
    unit: "day" | "week" | "month"
  ) => {
    const baseDate = selectedDate ?? currentDate;
    const newDate = new Date(baseDate);

    switch (unit) {
      case "day":
        newDate.setDate(newDate.getDate() + amount);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + amount * 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + amount);
        break;
    }

    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds);

    setSelectedDate(newDate);
    handleApplyTimeChange(newDate);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none focus:ring-0 relative">
          <Clock3 className="h-7 w-7" />
          {isModified && (
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-amber-500">
              <span className="sr-only">Time modified</span>
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[350px] p-4 mt-1 mr-2 bg-slate-900 text-white border-slate-700 max-h-[80vh] overflow-y-auto">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <DropdownMenuLabel className="text-lg font-bold p-0">
                  Time Machine
                </DropdownMenuLabel>
                {isModified && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/20 text-amber-300 border-amber-500"
                  >
                    Modified Time
                  </Badge>
                )}
              </div>

              <div className="bg-slate-800 p-3 rounded-md">
                <div className="text-sm text-slate-400">
                  Current System Date/Time:
                </div>
                <div className="text-xl font-mono mt-1">
                  {currentDate.toLocaleDateString()}{" "}
                  {currentDate.toLocaleTimeString()}
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Set Custom Date</Label>
                <div className="bg-slate-800 border border-slate-700 rounded-md p-2">
                  <div className="flex justify-center bg-gray-300">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date ?? undefined)}
                      inline
                      wrapperClassName="w-full"
                      openToDate={currentDate}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Set Custom Time</Label>
                <div className="flex space-x-2">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs text-slate-400">Hours</Label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={hours}
                      onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs text-slate-400">Minutes</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) =>
                        setMinutes(parseInt(e.target.value) || 0)
                      }
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs text-slate-400">Seconds</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) =>
                        setSeconds(parseInt(e.target.value) || 0)
                      }
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  className="flex-3 bg-amber-600 hover:bg-amber-700"
                  onClick={handleApplyClick}
                >
                  Apply Time Change
                </Button>
                <Button
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={handleResetTime}
                >
                  Reset
                </Button>
              </div>

              <div className="text-sm text-slate-400">
                Note: Triggering a time change will send all the notifications
                of the specified day to all users.
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Jumps</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="justify-start bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    onClick={() => addTimeToSelectedDate(1, "day")}
                  >
                    +1 Day
                  </Button>
                  <Button
                    size="sm"
                    className="justify-start bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    onClick={() => addTimeToSelectedDate(1, "week")}
                  >
                    +1 Week
                  </Button>
                  <Button
                    size="sm"
                    className="justify-start bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    onClick={() => addTimeToSelectedDate(1, "month")}
                  >
                    +1 Month
                  </Button>
                  <Button
                    size="sm"
                    className="justify-start bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    onClick={() => addTimeToSelectedDate(3, "month")}
                  >
                    +3 Months
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <DropdownMenuLabel className="text-lg font-bold p-0">
                  Enter Password
                </DropdownMenuLabel>
                <div className="text-sm text-slate-400">
                  The Time Machine feature allows you to change the current time
                  relative to the entire mCal system. It is password protected.
                  Please enter the admin password to access the Time Machine.
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="bg-slate-800 border-slate-700"
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button
                  className="bg-amber-600 hover:bg-amber-700 w-full"
                  onClick={() => {
                    if (password === REQUIRED_PASSWORD) {
                      setIsAuthenticated(true);
                      setPassword("");
                      setError("");
                    } else {
                      setError("Incorrect password");
                    }
                  }}
                >
                  Unlock
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
