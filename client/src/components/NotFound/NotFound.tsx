import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mx-auto flex max-w-[500px] flex-col items-center space-y-6">
        <div className="flex items-center justify-center space-x-2 text-primary">
          <Calendar className="h-12 w-12" />
          <Clock className="h-10 w-10" />
          <FileText className="h-12 w-12" />
        </div>

        <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">404</h1>

        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Page not found
        </h2>

        <p className="text-muted-foreground">
          Oops! The page you're looking for doesn't exist in your mCal
          workspace.
        </p>

        <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild className="gap-0">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-0">
            <Link to="/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Go to Calendar
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 text-sm text-muted-foreground">
        <p>mCal - Your all-in-one productivity solution</p>
      </div>
    </div>
  );
}
