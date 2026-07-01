"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format, addDays, subDays, isToday } from "date-fns";
import { motion } from "framer-motion";
import { GlassButton } from "@/shared/ui/glass-button";
import { cn } from "@/shared/utils/cn";

interface DateNavigatorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DateNavigator({ date, onDateChange }: DateNavigatorProps): React.ReactElement {
  const todayActive = isToday(date);

  return (
    <div className="flex items-center gap-3">
      <GlassButton
        size="icon"
        variant="ghost"
        onClick={() => onDateChange(subDays(date, 1))}
        aria-label="Previous day"
      >
        <ChevronLeft size={18} />
      </GlassButton>

      <motion.div
        key={date.toISOString()}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex min-w-[160px] flex-col items-center"
      >
        <span className="text-base font-semibold">{format(date, "EEEE")}</span>
        <span className="text-xs text-muted-foreground">{format(date, "dd MMM yyyy")}</span>
      </motion.div>

      <GlassButton
        size="icon"
        variant="ghost"
        onClick={() => onDateChange(addDays(date, 1))}
        aria-label="Next day"
      >
        <ChevronRight size={18} />
      </GlassButton>

      <GlassButton
        size="sm"
        variant={todayActive ? "primary" : "outline"}
        onClick={() => onDateChange(new Date())}
        className={cn("gap-1.5", todayActive && "pointer-events-none")}
        aria-label="Go to today"
      >
        <CalendarDays size={14} />
        Today
      </GlassButton>
    </div>
  );
}
