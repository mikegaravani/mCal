import { Clock, PenLine, Star } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ViewNoteProps {
  isOpen: boolean;
  onClose: () => void;
  note: {
    title: string;
    content: string;
    date: string;
    updateDate: string;
    tags: string[];
    color: string;
    starred?: boolean;
  } | null;
}

export function ViewNote({ isOpen, onClose, note }: ViewNoteProps) {
  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="sr-only">{note.title}</DialogTitle>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <div className={`${note.color} p-6 relative`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <h2 className="text-2xl font-bold leading-tight">{note.title}</h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {note.date}
                </div>
                <div className="flex items-center">
                  <PenLine className="h-3 w-3 mr-1" />
                  {note.updateDate}
                </div>
                {note.starred && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="p-6 max-h-[calc(90vh-150px)]">
          <div className="space-y-6">
            {/* Note content */}
            <div className="whitespace-pre-line text-base">{note.content}</div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
