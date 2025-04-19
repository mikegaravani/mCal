import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type EventType } from "./mockEventGen";

type EventDialogProps = {
  event: EventType | null;
  onClose: () => void;
  getCategoryColor: (category: string) => { bg: string; color: string };
};

const EventDialog = ({
  event,
  onClose,
  getCategoryColor,
}: EventDialogProps) => {
  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {event && (
          <>
            <DialogHeader>
              <DialogTitle>{event.title}</DialogTitle>
              <DialogDescription>
                <Badge
                  className={`${
                    getCategoryColor(event.category).bg
                  } text-white`}
                >
                  {event.category.charAt(0).toUpperCase() +
                    event.category.slice(1)}
                </Badge>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <div>
                <span className="font-medium">Time: </span>
                {event.allDay
                  ? "All day"
                  : `${new Date(event.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${
                      event.end
                        ? new Date(event.end).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""
                    }`}
              </div>
              <div>
                <span className="font-medium">Date: </span>
                {new Date(event.start).toLocaleDateString()}
              </div>
              {event.description && (
                <div>
                  <span className="font-medium">Description: </span>
                  {event.description}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
