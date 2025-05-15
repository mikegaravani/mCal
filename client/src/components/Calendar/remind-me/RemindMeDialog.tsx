import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

import { RemindOptions, DayOption } from "../types/reminders";

export type RemindMeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (remindOptions: any) => void;
};

export default function RemindMeDialog({
  open,
  onOpenChange,
  onSave,
}: RemindMeDialogProps) {
  const [repeatEnabled, setRepeatEnabled] = useState(false);

  const [tab, setTab] = useState<"before" | "custom">("before");

  // Before Event Options
  const [beforeValue, setBeforeValue] = useState(30);
  const [beforeUnit, setBeforeUnit] = useState<"minutes" | "hours" | "days">(
    "minutes"
  );

  // Custom Time Options
  const [dayOption, setDayOption] = useState<DayOption>("event-day");
  const [hour12, setHour12] = useState<number>(9);
  const [minute, setMinute] = useState<string>("00");
  const [ampm, setAmpm] = useState<"am" | "pm">("am");

  // Repeat Reminder Options
  const [repeatEvery, setRepeatEvery] = useState<number | null>(5);
  const [repeatUnit, setRepeatUnit] = useState<"minutes" | "hours">("minutes");
  const [stopMode, setStopMode] = useState<"count" | "until-event">("count");
  const [repeatCount, setRepeatCount] = useState<number | null>(3);

  function wireRemind(): RemindOptions {
    const base: RemindOptions = {
      mode: tab,
      repeat: {
        enabled: repeatEnabled,
        ...(repeatEnabled && {
          everyValue: repeatEvery ?? 5,
          everyUnit: repeatUnit,
          stopMode,
          countValue: repeatCount ?? 3,
        }),
      },
    };

    const numericMinute = parseInt(minute, 10);

    if (tab === "before") {
      return {
        ...base,
        beforeValue,
        beforeUnit,
      };
    }

    return {
      ...base,
      dayOption,
      hour12,
      minute: numericMinute,
      ampm,
    };
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[9998]" />
        <DialogContent className="z-[9998] sm:max-w-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Reminder Settings
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Initial Reminder */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Remind me</Label>

              <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as "before" | "custom")}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger
                    className="border-0 focus:ring-0 focus:ring-transparent focus:outline-none"
                    value="before"
                  >
                    Before the event
                  </TabsTrigger>
                  <TabsTrigger
                    className="border-0 focus:ring-0 focus:ring-transparent focus:outline-none"
                    value="custom"
                  >
                    At a specific time
                  </TabsTrigger>
                </TabsList>

                {/* Before Event Options */}
                <TabsContent value="before" className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Select
                      value={beforeValue.toString()}
                      onValueChange={(v) => setBeforeValue(+v)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent
                        className="z-[9998] max-h-[200px] overflow-y-auto"
                        position="popper"
                        side="bottom"
                        align="start"
                        sideOffset={5}
                      >
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={beforeUnit}
                      onValueChange={(v) =>
                        setBeforeUnit(v as typeof beforeUnit)
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        side="bottom"
                        align="start"
                        sideOffset={5}
                        className="z-[9998]"
                      >
                        <SelectItem value="minutes">minute(s)</SelectItem>
                        <SelectItem value="hours">hour(s)</SelectItem>
                        <SelectItem value="days">day(s)</SelectItem>
                      </SelectContent>
                    </Select>

                    <span>before the event</span>
                  </div>
                </TabsContent>

                {/* Custom Time Options */}
                <TabsContent value="custom" className="space-y-4">
                  <div className="flex flex-col gap-2">
                    {/* Line 1: Day Selector */}
                    <div className="flex items-center gap-3">
                      <span>On</span>
                      <Select
                        value={dayOption}
                        onValueChange={(v) => setDayOption(v as DayOption)}
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className="z-[9998]"
                        >
                          <SelectItem value="event-day">
                            Day of the event
                          </SelectItem>
                          <SelectItem value="day-before">Day before</SelectItem>
                          <SelectItem value="two-days-before">
                            Two days before
                          </SelectItem>
                          <SelectItem value="week-before">
                            Week before
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Line 2: Time Selector */}
                    <div className="flex items-center gap-3">
                      <span>at</span>
                      <Select
                        value={hour12.toString()}
                        onValueChange={(v) => setHour12(+v)}
                      >
                        <SelectTrigger className="w-16">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9998] max-h-[200px] overflow-y-auto"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span>:</span>

                      <Select value={minute} onValueChange={setMinute}>
                        <SelectTrigger className="w-18">
                          <SelectValue placeholder="Minute" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9998] max-h-[200px] overflow-y-auto"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                        >
                          {[
                            "00",
                            "05",
                            "10",
                            "15",
                            "20",
                            "25",
                            "30",
                            "35",
                            "40",
                            "45",
                            "50",
                            "55",
                          ].map((minute) => (
                            <SelectItem key={minute} value={minute}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={ampm}
                        onValueChange={(v) => setAmpm(v as "am" | "pm")}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className="z-[9998]"
                        >
                          <SelectItem value="am">AM</SelectItem>
                          <SelectItem value="pm">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Repeat Options */}
            <div className="space-y-4 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Repeat reminder</Label>
                <Switch
                  checked={repeatEnabled}
                  onCheckedChange={setRepeatEnabled}
                  id="repeat-switch"
                />
              </div>

              {repeatEnabled && (
                <div className="space-y-6 mt-4 pl-4 border-l-2 border-gray-200">
                  {/* How often to repeat */}
                  <div className="space-y-2">
                    <Label className="font-medium pb-2 underline">
                      How often
                    </Label>
                    <div className="flex items-center gap-3">
                      <Label>Repeat every</Label>
                      <Input
                        type="number"
                        min="1"
                        className="w-18"
                        value={repeatEvery === null ? "" : repeatEvery}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            setRepeatEvery(null);
                            return;
                          }

                          const parsed = parseInt(raw, 10);
                          if (!isNaN(parsed)) {
                            setRepeatEvery(parsed);
                          }
                        }}
                        onBlur={() => {
                          if (repeatEvery === null || repeatEvery < 1) {
                            setRepeatEvery(5);
                          }
                        }}
                      />

                      <Select
                        value={repeatUnit}
                        onValueChange={(v) =>
                          setRepeatUnit(v as "minutes" | "hours")
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className="z-[9998]"
                        >
                          <SelectItem value="minutes">minute(s)</SelectItem>
                          <SelectItem value="hours">hour(s)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* When to stop */}
                  <div className="space-y-2">
                    <Label className="font-medium underline pb-2">
                      When to stop
                    </Label>
                    <RadioGroup
                      value={stopMode}
                      onValueChange={(v) =>
                        setStopMode(v as "count" | "until-event")
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="count" id="count" />
                        <Label htmlFor="count">After</Label>
                        <Input
                          type="number"
                          min="1"
                          className="w-18 ml-1"
                          value={repeatCount === null ? "" : repeatCount}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              setRepeatCount(null);
                              return;
                            }

                            const parsed = parseInt(raw, 10);
                            if (!isNaN(parsed)) {
                              setRepeatCount(parsed);
                            }
                          }}
                          onBlur={() => {
                            if (repeatCount === null || repeatCount < 1) {
                              setRepeatCount(3);
                            }
                          }}
                        />

                        <Label>reminders</Label>
                      </div>

                      <div className="flex items-center space-x-2 mt-3">
                        <RadioGroupItem value="until-event" id="until-event" />
                        <Label htmlFor="until-event">
                          Until the event starts
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave(wireRemind());
                onOpenChange(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
