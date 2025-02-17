import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBanner } from "./TopBanner";

function Layout() {
  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen flex-col">
          <TopBanner />
          <div className="flex flex-1 pt-14">
            {" "}
            {/* Add top padding to account for the banner */}
            <AppSidebar />
            <SidebarInset className="flex-1 overflow-auto">
              <main>
                <Outlet />
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

export default Layout;
