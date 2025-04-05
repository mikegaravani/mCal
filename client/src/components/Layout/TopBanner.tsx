import { SidebarTrigger } from "@/components/ui/sidebar";
import { MenuIcon } from "lucide-react";
import TimeMachine from "@/components/TimeMachine/TimeMachine";

export function TopBanner() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b px-4 lg:px-6 bg-background">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarTrigger>
          <h2 className="text-lg font-semibold">mCal</h2>
        </div>

        <div className="flex items-center gap-4">
          <TimeMachine />
        </div>
      </div>
    </header>
  );
}
