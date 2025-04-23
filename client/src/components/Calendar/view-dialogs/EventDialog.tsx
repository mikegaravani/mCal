import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Edit, Copy, Trash2 } from "lucide-react";
import { Event } from "../types/calendarType";
import { useEffect } from "react";

type EventDialogProps = {
  event: Event | null;
  onClose: () => void;
  getTypeColor: (type: "event") => { bg: string; color: string };
};

const EventDialog: React.FC<EventDialogProps> = ({
  event,
  onClose,
  getTypeColor,
}) => {
  if (!event) return null;

  const [isEventOneDay, setIsEventOneDay] = useState(true);

  const typeColor = getTypeColor(event.type);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventOneDayCheck = () => {
    if (!event.endTime) return true;

    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    return (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    );
  };

  useEffect(() => {
    if (event) {
      setIsEventOneDay(isEventOneDayCheck());
    }
  }, [event]);

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="z-[9999] sm:max-w-[550px] p-0 overflow-hidden rounded-lg">
        <div className="h-2" style={{ backgroundColor: typeColor.bg }} />

        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <Badge className={`${typeColor.bg} text-white mb-2`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
                <DialogTitle className="text-2xl font-bold">
                  {event.title}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          {/* Event is just one day: no need to display the same date twice */}
          <div className="space-y-6">
            <Separator />

            {isEventOneDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{formatDate(event.startTime)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">
                      {event.isAllDay ? (
                        "All day"
                      ) : (
                        <>
                          {formatTime(event.startTime)}
                          {event.endTime && ` - ${formatTime(event.endTime)}`}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Event is not just one day: display starting and ending dates */}
            {!isEventOneDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Starting Date</p>
                    <p className="font-medium">
                      {formatDate(event.startTime)}
                      {!event.isAllDay && (
                        <> at {formatTime(event.startTime)}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Ending Date</p>
                    <p className="font-medium">
                      {formatDate(event.endTime)}
                      {!event.isAllDay && <> at {formatTime(event.endTime)}</>}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {event.description && <Separator />}

            {event.description && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Description</p>
                <div className="p-3 bg-gray-100/50 rounded-lg">
                  <p>{event.description}</p>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </Button>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
