import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  ListTodo,
  Play,
  Plus,
  Settings,
} from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";

import { getNotes } from "@/api/notes";
import { usePomodoroStore } from "@/store/usePomodoroStore";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function HomePage() {
  const [latestNote, setLatestNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        const notes: Note[] = response.data;

        if (notes.length > 0) {
          const sortedNotes = notes.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setLatestNote(sortedNotes[0]);
        }
      } catch (error) {
        console.error("Failed to fetch notes", error);
      }
    };

    fetchNotes();
  }, []);

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);

  const events = [
    {
      id: 1,
      title: "Team Meeting",
      date: format(addDays(startOfCurrentWeek, 1), "yyyy-MM-dd"),
      time: "10:00 AM",
      type: "meeting",
    },
    {
      id: 2,
      title: "Project Review",
      date: format(addDays(startOfCurrentWeek, 2), "yyyy-MM-dd"),
      time: "2:00 PM",
      type: "meeting",
    },
    {
      id: 3,
      title: "Client Call",
      date: format(addDays(startOfCurrentWeek, 3), "yyyy-MM-dd"),
      time: "11:30 AM",
      type: "call",
    },
  ];

  const tasks = [
    {
      id: 1,
      title: "Finish dashboard design",
      completed: true,
      dueDate: format(addDays(startOfCurrentWeek, 1), "yyyy-MM-dd"),
    },
    {
      id: 2,
      title: "Review pull requests",
      completed: false,
      dueDate: format(addDays(startOfCurrentWeek, 2), "yyyy-MM-dd"),
    },
    {
      id: 3,
      title: "Update documentation",
      completed: false,
      dueDate: format(addDays(startOfCurrentWeek, 4), "yyyy-MM-dd"),
    },
  ];

  const latsestNote = {
    title: "Project Ideas",
    content:
      "We should consider implementing a dark mode option for better user experience at night. Also, the analytics dashboard could use some improvements in data visualization.",
    createdAt: "2 hours ago",
  };

  const projects = [
    { id: 1, title: "Website Redesign", progress: 75, dueDate: "May 15, 2024" },
    { id: 2, title: "Mobile App", progress: 30, dueDate: "June 20, 2024" },
  ];

  const { pomodoroMinutes, breakMinutes, setPomodoroMinutes, setBreakMinutes } =
    usePomodoroStore();

  return (
    <>
      <div className="flex flex-col gap-6 p-6 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              {format(today, "EEEE, MMMM d")}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Calendar Card */}
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Calendar</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add event</span>
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="events">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="space-y-4 pt-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.date), "EEE, MMM d")} ·{" "}
                            {event.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="tasks" className="space-y-4 pt-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${
                            task.completed ? "bg-green-100" : "bg-primary/10"
                          }`}
                        >
                          <ListTodo
                            className={`h-5 w-5 ${
                              task.completed ? "text-green-600" : "text-primary"
                            }`}
                          />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              task.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Due {format(new Date(task.dueDate), "EEE, MMM d")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={task.completed ? "ghost" : "outline"}
                        size="sm"
                      >
                        {task.completed ? "Completed" : "Complete"}
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All
              </Button>
            </CardFooter>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Latest Note</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add note</span>
              </Button>
            </CardHeader>
            <CardContent>
              {latestNote ? (
                <div className="space-y-2">
                  <h3 className="font-semibold">{latestNote.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {latestNote.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(latestNote.createdAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-semibold pb-2">No notes available!</h3>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Notes
              </Button>
            </CardFooter>
          </Card>

          {/* Pomodoro Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Pomodoro</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Focus Time: {pomodoroMinutes} min
                    </span>
                  </div>
                  <Slider
                    value={[pomodoroMinutes]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => setPomodoroMinutes(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Break Time: {breakMinutes} min
                    </span>
                  </div>
                  <Slider
                    value={[breakMinutes]}
                    min={1}
                    max={15}
                    step={1}
                    onValueChange={(value) => setBreakMinutes(value[0])}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Start Focus Session
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Projects Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="col-span-2 lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <ListTodo className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Projects</CardTitle>
              </div>
              <CardDescription>
                Next deadline:{" "}
                <span className="font-medium text-foreground">
                  {projects[0].dueDate}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                            alt={project.title}
                          />
                          <AvatarFallback>
                            {project.title.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due {project.dueDate}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={project.progress > 50 ? "default" : "outline"}
                      >
                        {project.progress}%
                      </Badge>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Projects
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
