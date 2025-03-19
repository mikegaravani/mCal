import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const tasks = [
  {
    id: 1,
    name: "Complete project report",
    importance: "High",
    timeRemaining: "2 days",
  },
  { id: 2, name: "Fix UI bugs", importance: "Medium", timeRemaining: "5 days" },
  {
    id: 3,
    name: "Prepare presentation",
    importance: "High",
    timeRemaining: "1 day",
  },
  {
    id: 4,
    name: "Update documentation",
    importance: "Low",
    timeRemaining: "7 days",
  },
];

const TaskTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next tasks</CardTitle>
        <CardDescription>Next deadlines coming up</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Importance</TableHead>
              <TableHead>Time Remaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.importance}</TableCell>
                <TableCell>{task.timeRemaining}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskTable;
