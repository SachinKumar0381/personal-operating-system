"use client";

import { useState } from "react";
import { GlassSidebar } from "@/shared/ui/glass-sidebar";
import { GlassNavbar } from "@/shared/ui/glass-navbar";

interface ShellUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AppShellProps {
  children: React.ReactNode;
  user: ShellUser;
}

export function AppShell({ children, user }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <GlassSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={user}
      />
      <main className="flex-1 overflow-auto flex flex-col">
        <GlassNavbar
          onMenuClick={() => setMobileOpen(true)}
          user={user}
        />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
