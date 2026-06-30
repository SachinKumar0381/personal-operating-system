"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { GlassButton } from "@/shared/ui/glass-button";

const THEMES = [
  { value: "light" as const, icon: Sun },
  { value: "dark" as const, icon: Moon },
  { value: "system" as const, icon: Monitor },
] as const;

export function ThemeToggle(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1 glass rounded-xl p-1">
      {THEMES.map(({ value, icon: Icon }) => (
        <GlassButton
          key={value}
          size="icon"
          variant={theme === value ? "primary" : "ghost"}
          onClick={() => setTheme(value)}
          aria-label={`Switch to ${value} theme`}
          className="h-8 w-8"
        >
          <Icon size={14} />
        </GlassButton>
      ))}
    </div>
  );
}
