import { GlassBadge } from "@/shared/ui/glass-badge";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassInput } from "@/shared/ui/glass-input";
import { ThemeToggle } from "@/shared/components/theme-toggle";

export default function HomePage(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-linear-to-br from-blue-50 to-indigo-100 p-8 dark:from-gray-900 dark:to-indigo-950">
      <ThemeToggle />

      <GlassCard variant="elevated" className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold">Personal Operating System</h1>
        <p className="mb-4 text-sm text-muted-foreground">Design system working correctly.</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <GlassBadge variant="primary">Active</GlassBadge>
          <GlassBadge variant="success">Done</GlassBadge>
          <GlassBadge variant="warning">Pending</GlassBadge>
          <GlassBadge variant="destructive">Blocked</GlassBadge>
        </div>
        <GlassInput placeholder="Glass input field..." />
      </GlassCard>

      <div className="flex flex-wrap gap-3">
        <GlassButton variant="primary">Primary</GlassButton>
        <GlassButton variant="default">Default</GlassButton>
        <GlassButton variant="ghost">Ghost</GlassButton>
        <GlassButton variant="outline">Outline</GlassButton>
        <GlassButton variant="destructive">Destructive</GlassButton>
      </div>

      <GlassCard variant="subtle" padding="sm" className="w-full max-w-sm">
        <p className="text-xs text-muted-foreground">Subtle glass card — light frost effect</p>
      </GlassCard>
    </main>
  );
}
