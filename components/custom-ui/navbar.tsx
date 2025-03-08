"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";

const generateInitials = (name?: string | null): string => {
  if (!name?.trim()) return "??";

  const parts = name.split(" ");
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

interface NavbarProps {
  appName?: string;
}

export const Navbar = ({ appName = "My App" }: NavbarProps) => {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between h-16 px-16 py-4">
      <h1 className="text-2xl font-bold">{appName}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={session?.user?.image ?? undefined}
              alt="User avatar"
            />
            <AvatarFallback>
              {generateInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
