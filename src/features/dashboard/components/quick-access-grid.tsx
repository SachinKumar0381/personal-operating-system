"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Scale,
  Dumbbell,
  Moon,
  Utensils,
  Sparkles,
  Cigarette,
  BookOpen,
  Code2,
  Server,
  Briefcase,
  FileText,
  Wallet,
  FlaskConical,
  BarChart3,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { ROUTES } from "@/shared/constants";
import type { QuickAccessTile } from "../types";

const tiles: QuickAccessTile[] = [
  {
    label: "Planner",
    href: ROUTES.PLANNER,
    icon: Calendar,
    iconWrapperClassName: "text-blue-500 bg-blue-500/10",
    description: "Daily planning",
  },
  {
    label: "Weight",
    href: ROUTES.WEIGHT,
    icon: Scale,
    iconWrapperClassName: "text-emerald-500 bg-emerald-500/10",
    description: "Weight tracking",
  },
  {
    label: "Workout",
    href: ROUTES.WORKOUT,
    icon: Dumbbell,
    iconWrapperClassName: "text-orange-500 bg-orange-500/10",
    description: "Log workouts",
  },
  {
    label: "Sleep",
    href: ROUTES.SLEEP,
    icon: Moon,
    iconWrapperClassName: "text-indigo-500 bg-indigo-500/10",
    description: "Sleep quality",
  },
  {
    label: "Meals",
    href: ROUTES.MEALS,
    icon: Utensils,
    iconWrapperClassName: "text-yellow-500 bg-yellow-500/10",
    description: "Meal tracking",
  },
  {
    label: "Hair",
    href: ROUTES.HAIR,
    icon: Sparkles,
    iconWrapperClassName: "text-pink-500 bg-pink-500/10",
    description: "Hair care log",
  },
  {
    label: "Smoking",
    href: ROUTES.SMOKING,
    icon: Cigarette,
    iconWrapperClassName: "text-red-500 bg-red-500/10",
    description: "Quit smoking",
  },
  {
    label: "Study",
    href: ROUTES.STUDY,
    icon: BookOpen,
    iconWrapperClassName: "text-purple-500 bg-purple-500/10",
    description: "Study sessions",
  },
  {
    label: "DSA",
    href: ROUTES.DSA,
    icon: Code2,
    iconWrapperClassName: "text-cyan-500 bg-cyan-500/10",
    description: "Algorithm problems",
  },
  {
    label: "System Design",
    href: ROUTES.SYSTEM_DESIGN,
    icon: Server,
    iconWrapperClassName: "text-teal-500 bg-teal-500/10",
    description: "Design topics",
  },
  {
    label: "Jobs",
    href: ROUTES.JOBS,
    icon: Briefcase,
    iconWrapperClassName: "text-amber-500 bg-amber-500/10",
    description: "Job applications",
  },
  {
    label: "Resume",
    href: ROUTES.RESUME,
    icon: FileText,
    iconWrapperClassName: "text-lime-500 bg-lime-500/10",
    description: "Resume versions",
  },
  {
    label: "Finance",
    href: ROUTES.FINANCE,
    icon: Wallet,
    iconWrapperClassName: "text-green-500 bg-green-500/10",
    description: "Income & expenses",
  },
  {
    label: "Test Series",
    href: ROUTES.TEST_SERIES,
    icon: FlaskConical,
    iconWrapperClassName: "text-violet-500 bg-violet-500/10",
    description: "Project progress",
  },
  {
    label: "Reports",
    href: ROUTES.REPORTS,
    icon: BarChart3,
    iconWrapperClassName: "text-sky-500 bg-sky-500/10",
    description: "Analytics & insights",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function QuickAccessGrid(): React.ReactElement {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Quick Access
      </h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <motion.div key={tile.href} variants={item}>
              <Link
                href={tile.href}
                className={cn(
                  "glass group flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5 hover:scale-[1.02]",
                  "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    "transition-transform duration-200 group-hover:scale-110",
                    tile.iconWrapperClassName
                  )}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight">{tile.label}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                    {tile.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
