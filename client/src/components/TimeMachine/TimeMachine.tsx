import { Clock3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function TimeMachine() {
  // TODO make these functional THEY ARE NOT
  const isTimeModified = true;
  const currentDate = new Date();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none focus:ring-0 relative">
          <Clock3 className="h-7 w-7" />
          {isTimeModified && (
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-amber-500">
              <span className="sr-only">Time modified</span>
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[350px] p-4 mt-1 mr-2 bg-slate-900 text-white border-slate-700 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <DropdownMenuLabel className="text-lg font-bold p-0">
                Time Machine
              </DropdownMenuLabel>
              {isTimeModified && (
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
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    className="w-full h-full flex"
                    classNames={{
                      months:
                        "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                      month: "space-y-4 w-full flex flex-col",
                      table: "w-full h-full border-collapse space-y-1",
                      head_row: "",
                      row: "w-full mt-2",
                    }}
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
                    defaultValue={currentDate.getHours()}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs text-slate-400">Minutes</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    defaultValue={currentDate.getMinutes()}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs text-slate-400">Seconds</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    defaultValue={currentDate.getSeconds()}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button className="flex-3 bg-amber-600 hover:bg-amber-700">
                Apply Time Change
              </Button>
              <Button className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
                Reset
              </Button>
            </div>

            <Separator className="bg-slate-700" />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Jumps</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  className="justify-start bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  +1 Day
                </Button>
                <Button
                  size="sm"
                  className="justify-start bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  +1 Week
                </Button>
                <Button
                  size="sm"
                  className="justify-start bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  +1 Month
                </Button>
                <Button
                  size="sm"
                  className="justify-start bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  +3 Months
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
