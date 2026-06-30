import {
  LayoutDashboard,
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
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/shared/constants";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};

export type NavigationEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavigationEntry): entry is NavGroup {
  return "group" in entry;
}

export const navigationItems: NavigationEntry[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Planner", href: ROUTES.PLANNER, icon: Calendar },
  {
    group: "Health",
    items: [
      { label: "Weight", href: ROUTES.WEIGHT, icon: Scale },
      { label: "Workout", href: ROUTES.WORKOUT, icon: Dumbbell },
      { label: "Sleep", href: ROUTES.SLEEP, icon: Moon },
      { label: "Meals", href: ROUTES.MEALS, icon: Utensils },
      { label: "Hair", href: ROUTES.HAIR, icon: Sparkles },
      { label: "Smoking", href: ROUTES.SMOKING, icon: Cigarette },
    ],
  },
  {
    group: "Study",
    items: [
      { label: "Study", href: ROUTES.STUDY, icon: BookOpen },
      { label: "DSA", href: ROUTES.DSA, icon: Code2 },
      { label: "System Design", href: ROUTES.SYSTEM_DESIGN, icon: Server },
    ],
  },
  {
    group: "Career",
    items: [
      { label: "Jobs", href: ROUTES.JOBS, icon: Briefcase },
      { label: "Resume", href: ROUTES.RESUME, icon: FileText },
    ],
  },
  { label: "Finance", href: ROUTES.FINANCE, icon: Wallet },
  { label: "Test Series", href: ROUTES.TEST_SERIES, icon: FlaskConical },
  { label: "Reports", href: ROUTES.REPORTS, icon: BarChart3 },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];
