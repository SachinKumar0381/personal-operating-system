import { cn } from "@/shared/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const glassBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-white/15 dark:bg-white/10 text-foreground border border-white/20 dark:border-white/10 backdrop-blur-sm",
        primary:
          "bg-primary/15 text-primary border border-primary/20 backdrop-blur-sm",
        success:
          "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20 backdrop-blur-sm",
        warning:
          "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 backdrop-blur-sm",
        destructive:
          "bg-destructive/15 text-destructive border border-destructive/20 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface GlassBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof glassBadgeVariants> {}

function GlassBadge({ className, variant, ...props }: GlassBadgeProps): React.ReactElement {
  return <span className={cn(glassBadgeVariants({ variant }), className)} {...props} />;
}

export { GlassBadge, glassBadgeVariants };
