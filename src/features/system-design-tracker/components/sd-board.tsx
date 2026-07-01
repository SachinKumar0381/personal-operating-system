"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, ExternalLink, Server, CheckCircle2, Clock, RefreshCw, Circle } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { cn } from "@/shared/utils/cn";
import type { SystemDesignTopic, SdStatus } from "@/features/system-design-tracker/types";

interface SdBoardProps {
  topics: SystemDesignTopic[];
  onEdit: (topic: SystemDesignTopic) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SdStatus) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

const STATUS_CONFIG: Record<
  SdStatus,
  { label: string; icon: React.ReactNode; badgeClass: string; colClass: string }
> = {
  not_started: {
    label: "Not Started",
    icon: <Circle size={14} />,
    badgeClass: "bg-muted/40 text-muted-foreground border-white/15",
    colClass: "border-white/10",
  },
  in_progress: {
    label: "In Progress",
    icon: <Clock size={14} />,
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    colClass: "border-blue-500/20",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 size={14} />,
    badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
    colClass: "border-green-500/20",
  },
  needs_revision: {
    label: "Needs Revision",
    icon: <RefreshCw size={14} />,
    badgeClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
    colClass: "border-orange-500/20",
  },
};

const STATUS_ORDER: SdStatus[] = ["in_progress", "not_started", "needs_revision", "completed"];

const NEXT_STATUS: Record<SdStatus, SdStatus> = {
  not_started: "in_progress",
  in_progress: "completed",
  completed: "needs_revision",
  needs_revision: "not_started",
};

interface TopicCardProps {
  topic: SystemDesignTopic;
  onEdit: (topic: SystemDesignTopic) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: SdStatus) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

function TopicCard({
  topic,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdating,
}: TopicCardProps) {
  const cfg = STATUS_CONFIG[topic.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
    >
      <GlassCard
        variant="elevated"
        padding="md"
        className="group cursor-default space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug">{topic.title}</p>
          </div>
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <GlassButton
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => onEdit(topic)}
              aria-label="Edit topic"
            >
              <Pencil size={11} />
            </GlassButton>
            <GlassButton
              size="icon"
              variant="ghost"
              className="h-6 w-6 hover:text-destructive"
              onClick={() => onDelete(topic.id)}
              disabled={isDeleting}
              aria-label="Delete topic"
            >
              <Trash2 size={11} />
            </GlassButton>
          </div>
        </div>

        {topic.concepts.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topic.concepts.slice(0, 4).map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] text-muted-foreground dark:border-white/10 dark:bg-white/5"
              >
                {c}
              </span>
            ))}
            {topic.concepts.length > 4 && (
              <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] text-muted-foreground dark:border-white/10 dark:bg-white/5">
                +{topic.concepts.length - 4}
              </span>
            )}
          </div>
        )}

        {topic.notes && (
          <p className="line-clamp-2 text-[11px] text-muted-foreground">{topic.notes}</p>
        )}

        {topic.resources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topic.resources.slice(0, 2).map((url, i) => {
              let hostname = url;
              try {
                hostname = new URL(url).hostname.replace("www.", "");
              } catch {
                hostname = url;
              }
              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={9} />
                  {hostname}
                </a>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm",
              cfg.badgeClass
            )}
          >
            {cfg.icon}
            {cfg.label}
          </span>
          <GlassButton
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-[10px]"
            onClick={() => onStatusChange(topic.id, NEXT_STATUS[topic.status])}
            disabled={isUpdating}
            aria-label="Advance status"
          >
            Move →
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function SdBoard({
  topics,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdating,
}: SdBoardProps): React.ReactElement {
  if (topics.length === 0) {
    return (
      <GlassCard
        variant="elevated"
        padding="md"
        className="flex flex-col items-center gap-3 py-16"
      >
        <Server size={36} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No topics yet. Add your first system design topic.</p>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATUS_ORDER.map((status) => {
        const cfg = STATUS_CONFIG[status];
        const columnTopics = topics.filter((t) => t.status === status);

        return (
          <div key={status} className="flex flex-col gap-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2",
                "bg-white/5 dark:bg-white/3",
                cfg.colClass
              )}
            >
              <span className={cn("flex items-center gap-1.5 text-xs font-medium")}>
                {cfg.icon}
                {cfg.label}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{columnTopics.length}</span>
            </div>

            <div className="flex flex-col gap-2.5 min-h-[4rem]">
              <AnimatePresence mode="popLayout">
                {columnTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    isDeleting={isDeleting}
                    isUpdating={isUpdating}
                  />
                ))}
              </AnimatePresence>
              {columnTopics.length === 0 && (
                <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-muted-foreground/50">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
