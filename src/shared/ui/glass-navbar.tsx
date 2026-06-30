"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { GlassButton } from "@/shared/ui/glass-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { navigationItems, isNavGroup } from "@/config/navigation";
import { ROUTES } from "@/shared/constants";

interface ShellUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface GlassNavbarProps {
  onMenuClick: () => void;
  user: ShellUser;
}

function getPageTitle(pathname: string): string {
  for (const entry of navigationItems) {
    if (isNavGroup(entry)) {
      for (const item of entry.items) {
        if (pathname === item.href || pathname.startsWith(item.href + "/")) {
          return item.label;
        }
      }
    } else {
      if (pathname === entry.href || pathname.startsWith(entry.href + "/")) {
        return entry.label;
      }
    }
  }
  return "Personal Operating System";
}

export function GlassNavbar({ onMenuClick, user }: GlassNavbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10 dark:border-white/5 px-4 h-14 flex items-center gap-3">
      {/* Mobile hamburger */}
      <GlassButton
        variant="ghost"
        size="icon"
        className={cn("lg:hidden h-8 w-8")}
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={17} />
      </GlassButton>

      {/* Page title */}
      <h1 className="flex-1 text-sm font-semibold tracking-tight">{title}</h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary uppercase hover:bg-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="User menu"
            >
              {user?.name?.[0] ?? "U"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 glass border-white/20 dark:border-white/10 backdrop-blur-2xl"
          >
            <div className="px-2 py-2">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={ROUTES.SETTINGS} className="cursor-pointer">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => signOut({ redirectTo: ROUTES.LOGIN })}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
