import { SidebarTrigger } from "@/components/ui/sidebar";
import { MenuIcon } from "lucide-react";

export function TopBanner() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b px-4 lg:px-6 bg-background">
      <SidebarTrigger className="lg:hidden">
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle Sidebar</span>
      </SidebarTrigger>
      <div className="ml-4 flex items-center gap-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
    </header>
  );
}
