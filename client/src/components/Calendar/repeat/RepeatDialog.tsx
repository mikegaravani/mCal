import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
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
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";

import { DayOfWeek } from "../types/dayOfWeek";
import { Recurrence } from "../types/recurrence";

export type RepeatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (repeatOptions: any) => void;
};

export default function RepeatDialog({
  open,
  onOpenChange,
  onSave,
}: RepeatDialogProps) {
  const [frequency, setFrequency] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  const [frequencyInterval, setFrequencyInterval] = useState(1);

  // Weekly
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);

  // Monthly
  const [monthlyRepeatBy, setMonthlyRepeatBy] = useState<
    "day-of-month" | "day-position"
  >("day-of-month");
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [monthlyPosition, setMonthlyPosition] = useState<
    "first" | "second" | "third" | "fourth" | "last"
  >("first");
  const [monthlyDayOfWeek, setMonthlyDayOfWeek] = useState<DayOfWeek>("monday");

  // Yearly
  const [yearlyRepeatBy, setYearlyRepeatBy] = useState<
    "specific-date" | "relative-date"
  >("specific-date");
  const [yearlyMonth, setYearlyMonth] = useState<number>(1);
  const [yearlyDay, setYearlyDay] = useState<number>(1);
  const [yearlyPosition, setYearlyPosition] = useState<
    "first" | "second" | "third" | "fourth" | "last"
  >("first");
  const [yearlyDayOfWeek, setYearlyDayOfWeek] = useState<DayOfWeek>("monday");

  // End conditions
  const [endCondition, setEndCondition] = useState<
    "never" | "after" | "on-date"
  >("never");

  const [untilNumber, setUntilNumber] = useState<number>(10);
  const [untilDate, setUntilDate] = useState<Date | null>(null);

  const daysOfWeekMap = [
    { label: "Sat", full: "sunday", value: 0 },
    { label: "Mon", full: "monday", value: 1 },
    { label: "Tue", full: "tuesday", value: 2 },
    { label: "Wed", full: "wednesday", value: 3 },
    { label: "Thu", full: "thursday", value: 4 },
    { label: "Fri", full: "friday", value: 5 },
    { label: "Sat", full: "saturday", value: 6 },
  ];

  const wireRecurrence = () => {
    const recurrence: Recurrence = {
      frequency,
      frequencyInterval,
    };

    // Add frequency-specific settings
    if (frequency === "weekly") {
      recurrence.weekly = {
        daysOfWeek: selectedDaysOfWeek.length ? selectedDaysOfWeek : undefined,
      };
    }

    if (frequency === "monthly") {
      recurrence.monthly = {
        repeatBy: monthlyRepeatBy,
        ...(monthlyRepeatBy === "day-of-month"
          ? { dayOfMonth }
          : {
              positionInMonth: monthlyPosition,
              dayOfWeek: monthlyDayOfWeek,
            }),
      };
    }

    if (frequency === "yearly") {
      recurrence.yearly = {
        repeatBy: yearlyRepeatBy,
        month: yearlyMonth,
        ...(yearlyRepeatBy === "specific-date"
          ? { day: yearlyDay }
          : {
              positionInMonth: yearlyPosition,
              dayOfWeek: yearlyDayOfWeek,
            }),
      };
    }

    if (endCondition === "never") {
      recurrence.endless = true;
    } else if (endCondition === "after") {
      recurrence.endless = false;
      recurrence.untilNumber = untilNumber;
    } else if (endCondition === "on-date" && untilDate) {
      recurrence.endless = false;
      recurrence.untilDate = untilDate;
    }

    return recurrence;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[9998]" />
        <DialogContent className="z-[9998] sm:max-w-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Repeat Options
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Frequency Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Frequency</Label>
              <Tabs
                className="w-full"
                value={frequency}
                onValueChange={(val) =>
                  setFrequency(val as "daily" | "weekly" | "monthly" | "yearly")
                }
              >
                <TabsList className="w-full grid grid-cols-4 mb-4">
                  <TabsTrigger
                    className="border-0 focus:ring-0 focus:ring-transparent focus:outline-none"
                    value="daily"
                  >
                    Daily
                  </TabsTrigger>
                  <TabsTrigger
                    className="border-0 focus:ring-0 focus:ring-transparent focus:outline-none"
                    value="weekly"
                  >
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger
                    className="border-0 focus:ring-0 focus:ring-transparent focus:outline-none"
                    value="monthly"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    className="border-0 focus:ring-0 focus:ring-transparent focus:outline-none"
                    value="yearly"
                  >
                    Yearly
                  </TabsTrigger>
                </TabsList>

                {/* Daily Options */}
                <TabsContent value="daily" className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Label>Repeat every</Label>
                    <Input
                      type="number"
                      min="1"
                      className="w-16"
                      value={frequencyInterval}
                      onChange={(e) => {
                        setFrequencyInterval(Number(e.target.value));
                      }}
                    />
                    <span>day(s)</span>
                  </div>
                </TabsContent>

                {/* Weekly Options */}
                <TabsContent value="weekly" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Label>Repeat every</Label>
                    <Input
                      type="number"
                      min="1"
                      className="w-16"
                      value={frequencyInterval}
                      onChange={(e) => {
                        setFrequencyInterval(Number(e.target.value));
                      }}
                    />
                    <span>week(s)</span>
                  </div>

                  <Label className="block mb-2">On these days:</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeekMap.map(({ label, value }) => (
                      <div key={value} className="flex flex-col items-center">
                        <Checkbox
                          id={`day-${value}`}
                          className="mb-1"
                          checked={selectedDaysOfWeek.includes(value)}
                          onCheckedChange={(checked) => {
                            setSelectedDaysOfWeek((prev) =>
                              checked
                                ? [...prev, value]
                                : prev.filter((day) => day !== value)
                            );
                          }}
                        />
                        <Label htmlFor={`day-${value}`} className="text-xs">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Monthly Options */}
                <TabsContent value="monthly" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Label>Repeat every</Label>
                    <Input
                      type="number"
                      min="1"
                      className="w-16"
                      value={frequencyInterval}
                      onChange={(e) => {
                        setFrequencyInterval(Number(e.target.value));
                      }}
                    />
                    <span>month(s)</span>
                  </div>

                  <RadioGroup
                    value={monthlyRepeatBy}
                    onValueChange={(value) =>
                      setMonthlyRepeatBy(
                        value as "day-of-month" | "day-position"
                      )
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="day-of-month" id="day-of-month" />
                      <Label htmlFor="day-of-month">On day</Label>
                      <Select
                        value={dayOfMonth.toString()}
                        onValueChange={(val) => setDayOfMonth(parseInt(val))}
                      >
                        <SelectTrigger className="w-18">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9998] max-h-[200px] overflow-y-auto"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                        >
                          {Array.from({ length: 31 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value="day-position" id="day-position" />
                      <Label htmlFor="day-position">On the</Label>
                      <Select
                        value={monthlyPosition}
                        onValueChange={(val) =>
                          setMonthlyPosition(val as typeof monthlyPosition)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Position" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className="z-[9998]"
                        >
                          <SelectItem value="first">First</SelectItem>
                          <SelectItem value="second">Second</SelectItem>
                          <SelectItem value="third">Third</SelectItem>
                          <SelectItem value="fourth">Fourth</SelectItem>
                          <SelectItem value="last">Last</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={monthlyDayOfWeek}
                        onValueChange={(val) =>
                          setMonthlyDayOfWeek(val as DayOfWeek)
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9998] max-h-[200px] overflow-y-auto"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                        >
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="weekday">Weekday</SelectItem>
                          <SelectItem value="weekend">Weekend day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </RadioGroup>
                </TabsContent>

                {/* Yearly Options */}
                <TabsContent value="yearly" className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Label>Repeat every</Label>
                    <Input
                      type="number"
                      min="1"
                      className="w-16"
                      value={frequencyInterval}
                      onChange={(e) => {
                        setFrequencyInterval(Number(e.target.value));
                      }}
                    />
                    <span>year(s)</span>
                  </div>

                  <RadioGroup
                    value={yearlyRepeatBy}
                    onValueChange={(val) =>
                      setYearlyRepeatBy(
                        val as "specific-date" | "relative-date"
                      )
                    }
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <RadioGroupItem
                        value="specific-date"
                        id="specific-date"
                      />
                      <Label htmlFor="specific-date">On</Label>
                      <Select
                        value={yearlyMonth.toString()}
                        onValueChange={(val) => setYearlyMonth(parseInt(val))}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9998] max-h-[200px] overflow-y-auto"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                        >
                          <SelectItem value="1">January</SelectItem>
                          <SelectItem value="2">February</SelectItem>
                          <SelectItem value="3">March</SelectItem>
                          <SelectItem value="4">April</SelectItem>
                          <SelectItem value="5">May</SelectItem>
                          <SelectItem value="6">June</SelectItem>
                          <SelectItem value="7">July</SelectItem>
                          <SelectItem value="8">August</SelectItem>
                          <SelectItem value="9">September</SelectItem>
                          <SelectItem value="10">October</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={yearlyDay.toString()}
                        onValueChange={(val) => setYearlyDay(parseInt(val))}
                      >
                        <SelectTrigger className="w-18">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9998] max-h-[200px] overflow-y-auto"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                        >
                          {Array.from({ length: 31 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <RadioGroupItem
                        value="relative-date"
                        id="relative-date"
                      />
                      <Label htmlFor="relative-date">On the</Label>
                      <Select
                        value={yearlyPosition}
                        onValueChange={(val) =>
                          setYearlyPosition(val as typeof yearlyPosition)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Position" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                          className="z-[9998]"
                        >
                          <SelectItem value="first">First</SelectItem>
                          <SelectItem value="second">Second</SelectItem>
                          <SelectItem value="third">Third</SelectItem>
                          <SelectItem value="fourth">Fourth</SelectItem>
                          <SelectItem value="last">Last</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={yearlyDayOfWeek}
                        onValueChange={(val) =>
                          setYearlyDayOfWeek(val as DayOfWeek)
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9998] max-h-[200px] overflow-y-auto"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                        >
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="weekday">Weekday</SelectItem>
                          <SelectItem value="weekend">Weekend day</SelectItem>
                        </SelectContent>
                      </Select>

                      <Label>of</Label>

                      <Select
                        value={yearlyMonth.toString()}
                        onValueChange={(val) => setYearlyMonth(parseInt(val))}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9998] max-h-[200px] overflow-y-auto"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={5}
                        >
                          <SelectItem value="1">January</SelectItem>
                          <SelectItem value="2">February</SelectItem>
                          <SelectItem value="3">March</SelectItem>
                          <SelectItem value="4">April</SelectItem>
                          <SelectItem value="5">May</SelectItem>
                          <SelectItem value="6">June</SelectItem>
                          <SelectItem value="7">July</SelectItem>
                          <SelectItem value="8">August</SelectItem>
                          <SelectItem value="9">September</SelectItem>
                          <SelectItem value="10">October</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </RadioGroup>
                </TabsContent>
              </Tabs>
            </div>

            {/* Repetition Limits */}
            <div className="space-y-4 pt-2 border-t">
              <Label className="text-base font-medium">Ends</Label>
              <RadioGroup
                value={endCondition}
                onValueChange={(val) =>
                  setEndCondition(val as typeof endCondition)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Never</Label>
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="after" id="after" />
                  <Label htmlFor="after">After</Label>
                  <Input
                    type="number"
                    min="1"
                    className="w-16"
                    value={untilNumber}
                    onChange={(e) => setUntilNumber(parseInt(e.target.value))}
                  />
                  <span>occurrences</span>
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="on-date" id="on-date" />
                  <Label htmlFor="on-date">On date</Label>
                  <DatePicker
                    placeholderText="Select end date"
                    selected={untilDate}
                    onChange={(date) => setUntilDate(date)}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "[caret-color:transparent]",
                      "max-w-[180px]"
                    )}
                    wrapperClassName="w-auto"
                  />
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const recurrence = wireRecurrence();
                onSave(recurrence);
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
