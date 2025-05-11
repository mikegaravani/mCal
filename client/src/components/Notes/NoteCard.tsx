import { MoreHorizontal, Star, Clock, PenLine } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
  id: number;
  title: string;
  content: string;
  date: string;
  updateDate: string;
  tags: string[];
  color: string;
  starred?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function NoteCard({
  title,
  content,
  date,
  updateDate,
  tags,
  color,
  starred = false,
  onView = () => {},
  onEdit = () => {},
  onDuplicate = () => {},
  onDelete = () => {},
}: NoteCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-all duration-200 p-0 gap-0 h-full flex flex-col cursor-pointer"
      onClick={(e) => {
        if (
          !(e.target as HTMLElement).closest(
            '[data-dropdown-trigger="true"]'
          ) &&
          !(e.target as HTMLElement).closest('[role="menu"]')
        ) {
          onView();
        }
      }}
    >
      <CardHeader className={`${color} p-4`}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>

          <div className="flex items-center gap-1">
            {starred && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-500 focus:text-red-500 focus:bg-red-50"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-sm whitespace-pre-line line-clamp-4">{content}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1 max-w-full">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md mb-1 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {date}
        </div>
        <div className="flex items-center">
          <PenLine className="h-3 w-3 mr-1" />
          {updateDate}
        </div>
      </CardFooter>
    </Card>
  );
}
