import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Star,
  Clock,
  Tag,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for notes
const mockNotes = [
  {
    id: 1,
    title: "Project Ideas",
    content:
      "1. Build a personal finance tracker\n2. Create a recipe app with AI suggestions\n3. Develop a habit tracker with streaks",
    date: "2 hours ago",
    tags: ["ideas", "projects"],
    color: "bg-amber-100 dark:bg-amber-900/20",
    starred: true,
  },
  {
    id: 2,
    title: "Meeting Notes",
    content:
      "Discussed Q3 goals and roadmap. Action items: Follow up with design team about new UI components.",
    date: "Yesterday",
    tags: ["work", "meetings"],
    color: "bg-blue-100 dark:bg-blue-900/20",
    starred: false,
  },
  {
    id: 3,
    title: "Books to Read",
    content:
      "- Atomic Habits by James Clear\n- Deep Work by Cal Newport\n- The Psychology of Money by Morgan Housel",
    date: "3 days ago",
    tags: ["reading", "personal"],
    color: "bg-green-100 dark:bg-green-900/20",
    starred: true,
  },
  {
    id: 4,
    title: "Grocery List",
    content: "Eggs\nMilk\nBread\nAvocados\nChicken\nRice\nVegetables",
    date: "1 week ago",
    tags: ["shopping", "personal"],
    color: "bg-purple-100 dark:bg-purple-900/20",
    starred: false,
  },
  {
    id: 5,
    title: "Workout Plan",
    content:
      "Monday: Upper body\nTuesday: Lower body\nWednesday: Rest\nThursday: HIIT\nFriday: Full body\nWeekend: Active recovery",
    date: "1 week ago",
    tags: ["health", "fitness"],
    color: "bg-red-100 dark:bg-red-900/20",
    starred: false,
  },
  {
    id: 6,
    title: "Coding Snippets",
    content:
      "```js\nconst formatDate = (date) => {\n  return new Date(date).toLocaleDateString();\n};\n```",
    date: "2 weeks ago",
    tags: ["coding", "reference"],
    color: "bg-indigo-100 dark:bg-indigo-900/20",
    starred: true,
  },
];

function Notes() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Notes</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </header>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Button variant="outline" size="sm" className="h-8">
              <Folder className="h-4 w-4 mr-2" />
              Folders
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockNotes.map((note) => (
                <Card
                  key={note.id}
                  className="overflow-hidden hover:shadow-md transition-shadow p-0"
                >
                  <CardHeader className={`${note.color} p-4`}>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">
                        {note.title}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {note.starred && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm whitespace-pre-line line-clamp-4">
                      {note.content}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {note.date}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="starred" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockNotes
                .filter((note) => note.starred)
                .map((note) => (
                  <Card
                    key={note.id}
                    className="overflow-hidden hover:shadow-md transition-shadow p-0"
                  >
                    <CardHeader className={`${note.color} p-4`}>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium">
                          {note.title}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm whitespace-pre-line line-clamp-4">
                        {note.content}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex gap-1">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-muted px-2 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {note.date}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockNotes.slice(0, 3).map((note) => (
                <Card
                  key={note.id}
                  className="overflow-hidden hover:shadow-md transition-shadow p-0"
                >
                  <CardHeader className={`${note.color} p-4`}>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">
                        {note.title}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {note.starred && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm whitespace-pre-line line-clamp-4">
                      {note.content}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted px-2 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {note.date}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Notes;
