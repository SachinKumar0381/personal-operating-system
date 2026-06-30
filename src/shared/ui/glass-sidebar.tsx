"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { navigationItems, isNavGroup, type NavItem } from "@/config/navigation";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";

interface ShellUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface GlassSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  user: ShellUser;
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/15 text-primary border border-primary/20"
          : "text-foreground/70 hover:bg-white/10 dark:hover:bg-white/5 hover:text-foreground"
      )}
    >
      <Icon
        size={15}
        className={cn("shrink-0", isActive ? "text-primary" : "text-foreground/50")}
      />
      {item.label}
    </Link>
  );
}

function SidebarContent({ pathname, user }: { pathname: string; user: ShellUser }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10 dark:border-white/5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
          <Zap size={15} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight leading-none">POS</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Personal OS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-none">
        {navigationItems.map((entry, i) => {
          if (isNavGroup(entry)) {
            return (
              <div key={entry.group} className={cn("space-y-0.5", i > 0 && "pt-3")}>
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  {entry.group}
                </p>
                {entry.items.map((item) => (
                  <NavLink key={item.href} item={item} pathname={pathname} />
                ))}
              </div>
            );
          }
          return <NavLink key={entry.href} item={entry} pathname={pathname} />;
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 dark:border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary uppercase">
            {user?.name?.[0] ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">{user?.name ?? "User"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GlassSidebar({ mobileOpen, onMobileClose, user }: GlassSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop — fixed left sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col h-screen sticky top-0 glass border-r border-white/10 dark:border-white/5">
        <SidebarContent pathname={pathname} user={user} />
      </aside>

      {/* Mobile — Sheet drawer */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose()}>
        <SheetContent
          side="left"
          className="w-60 p-0 border-r border-white/10 dark:border-white/5 bg-background/80 backdrop-blur-2xl"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent pathname={pathname} user={user} />
        </SheetContent>
      </Sheet>
    </>
  );
}
