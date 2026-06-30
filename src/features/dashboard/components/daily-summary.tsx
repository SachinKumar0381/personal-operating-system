import { CheckSquare, BookOpen, Dumbbell } from "lucide-react";
import { StatCard } from "./stat-card";

export function DailySummary(): React.ReactElement {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Today at a Glance
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Tasks"
          value="0"
          icon={CheckSquare}
          iconWrapperClassName="text-blue-500 bg-blue-500/10"
          description="No tasks logged yet"
        />
        <StatCard
          title="Study"
          value="0h 0m"
          icon={BookOpen}
          iconWrapperClassName="text-purple-500 bg-purple-500/10"
          description="No sessions logged yet"
        />
        <StatCard
          title="Workout"
          value="Rest day"
          icon={Dumbbell}
          iconWrapperClassName="text-orange-500 bg-orange-500/10"
          description="No workout logged yet"
        />
      </div>
    </div>
  );
}
