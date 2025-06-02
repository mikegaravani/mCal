import { Home, Calendar, Notebook, BookOpenText } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import UserDropdown from "./UserDropdown";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: Notebook,
  },
  {
    title: "Pomodoro",
    url: "/pomodoro",
    icon: BookOpenText,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r pt-14">
      {" "}
      {/* Add top padding to account for the banner */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>mCal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 text-base py-5"
                    >
                      <item.icon className="!w-6 !h-6" />
                      <span className="text-base font-medium">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
