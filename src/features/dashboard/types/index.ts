import type { LucideIcon } from "lucide-react";

export interface QuickAccessTile {
  label: string;
  href: string;
  icon: LucideIcon;
  iconWrapperClassName: string;
  description: string;
}
