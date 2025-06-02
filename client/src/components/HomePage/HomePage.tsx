import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  BookOpenText,
  Notebook,
  ListTodo,
  Play,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

import { getNotes } from "@/api/notes";
import { getEvents, getTasks } from "@/api/calendar";
import { usePomodoroStore } from "@/store/usePomodoroStore";
import { useTimeMachineStore } from "@/store/useTimeMachineStore";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
}

interface Event {
  _id: string;
  title: string;
  startTime: Date;
  isAllDay: boolean;
  location?: string;
}

interface Task {
  _id: string;
  title: string;
  isCompleted: boolean;
  dueDate: Date;
}

export default function HomePage() {
  const navigate = useNavigate();

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

  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const rightNow = useTimeMachineStore((state) => state.now);
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await getEvents();
        let eventsData: Event[] = response.data;

        eventsData.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        const upcomingEvents = eventsData.filter(
          (event) => new Date(event.startTime) > rightNow
        );

        setEvents(upcomingEvents.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    }

    fetchEvents();
  }, [rightNow]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await getTasks();
        let tasksData: Task[] = response.data;

        tasksData.sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );

        const upcomingTasks = tasksData.filter(
          (task) => new Date(task.dueDate) > rightNow
        );

        setTasks(upcomingTasks.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    }

    fetchTasks();
  }, [rightNow]);

  const {
    pomodoroMinutes,
    breakMinutes,
    setStartFromDashboard,
    setPomodoroMinutes,
    setBreakMinutes,
  } = usePomodoroStore();

  return (
    <>
      <div className="flex flex-col gap-6 p-6 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-md">
              <Clock
                className="mr-2"
                style={{ height: "1rem", width: "1rem" }}
              />
              {format(rightNow, "EEEE, MMMM d")}
            </Badge>
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
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="events">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="events"
                    className="border-0 focus:ring-0 focus:ring-transparent focus:outline-none"
                  >
                    Events
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="border-0 focus:ring-0 focus:ring-transparent focus:outline-none"
                  >
                    Tasks
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="space-y-4 pt-4">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div
                        key={event._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(event.startTime), "EEE, MMM d")}{" "}
                              ·{" "}
                              {new Date(event.startTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        {event.location && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1.5"
                          >
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {event.location}
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      No events coming soon!
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="tasks" className="space-y-4 pt-4">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              task.isCompleted
                                ? "bg-green-100"
                                : "bg-primary/10"
                            }`}
                          >
                            <ListTodo
                              className={`h-5 w-5 ${
                                task.isCompleted
                                  ? "text-green-600"
                                  : "text-primary"
                              }`}
                            />
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                task.isCompleted
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Due {format(new Date(task.dueDate), "EEE, MMM d")}{" "}
                              ·{" "}
                              {new Date(task.dueDate).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        {task.isCompleted && (
                          <Badge variant="secondary" className="text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      No tasks coming soon!
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/calendar")}
              >
                View All
              </Button>
            </CardFooter>
          </Card>

          {/* Notes Card */}
          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Notebook className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Latest Note</CardTitle>
              </div>
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
            <CardFooter className="mt-auto">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/notes")}
              >
                View All Notes
              </Button>
            </CardFooter>
          </Card>

          {/* Pomodoro Card */}
          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <BookOpenText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Pomodoro</CardTitle>
              </div>
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
            <CardFooter className="mt-auto">
              <Button
                className="w-full"
                onClick={() => {
                  setStartFromDashboard(true);
                  navigate("/pomodoro");
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Session
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
