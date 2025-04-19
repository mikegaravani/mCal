import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../../assets/welcome.png";

export default function Welcome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">mCal</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Features
            </a>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleLogin}>
                Log in
              </Button>
              <Button onClick={handleSignup}>Sign up</Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-30 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-top md:hidden">
          <div className="relative z-20 grid gap-6 rounded-md bg-background p-4 shadow-md">
            <a
              href="#features"
              className="flex items-center text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={handleLogin}>
                Log in
              </Button>
              <Button onClick={handleSignup}>Sign up</Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Boost Your Productivity with mCal
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Seamlessly manage your calendar, notes, and focus sessions
                    all in one place. Stay organized and accomplish more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" onClick={handleSignup}>
                    Sign Up
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleLogin}>
                    Log In
                  </Button>
                </div>
              </div>
              <img
                src={image}
                width={550}
                height={550}
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Stay Productive
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  mCal combines powerful productivity tools in one seamless
                  experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Smart Calendar</h3>
                  <p className="text-muted-foreground">
                    Intelligent scheduling that adapts to your preferences and
                    priorities.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Powerful Notes</h3>
                  <p className="text-muted-foreground">
                    Capture ideas, create to-do lists, and organize your
                    thoughts with rich formatting.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Pomodoro Timer</h3>
                  <p className="text-muted-foreground">
                    Stay focused and manage your time effectively with
                    customizable work sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Boost Your Productivity?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who have transformed their
                  productivity with mCal.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" onClick={handleSignup}>
                  Sign Up Now
                </Button>
                <Button size="lg" variant="outline" onClick={handleLogin}>
                  Log In
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">
              © {new Date().getFullYear()} mCal. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <a
              href="#"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Privacy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
