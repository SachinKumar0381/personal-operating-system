"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { useSession } from "@/features/auth/hooks/use-session";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const SUBTITLES = [
  "Every day is a step toward your goals.",
  "Your future is built one day at a time.",
  "Focus, execute, and grow.",
  "Small progress is still progress.",
  "Make today count.",
  "Stay consistent. Results follow.",
  "The best time to act is now.",
];

export function WelcomeSection(): React.ReactElement {
  const { user } = useSession();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const subtitle = SUBTITLES[new Date().getDay() % SUBTITLES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <GlassCard variant="elevated" padding="lg">
        <p
          suppressHydrationWarning
          className="text-sm font-medium text-muted-foreground"
        >
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
        <h1
          suppressHydrationWarning
          className="mt-1 text-2xl font-semibold tracking-tight"
        >
          {getGreeting()}, {firstName}
        </h1>
        <p suppressHydrationWarning className="mt-1 text-sm text-muted-foreground">
          {subtitle}
        </p>
      </GlassCard>
    </motion.div>
  );
}
