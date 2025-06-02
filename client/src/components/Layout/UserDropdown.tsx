import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SquareUserRound, ChevronUp } from "lucide-react";

export default function UserDropdown() {
  const { user, fetchUser, loading } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/welcome", { replace: true });
    window.location.reload();
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="w-full justify-between">
          <div className="flex items-center">
            <SquareUserRound className="mr-2" />
            <span>{loading ? "Loading..." : user?.username ?? "Guest"}</span>
          </div>
          <ChevronUp />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>👋</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
