import { cn } from "@/shared/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "glass hover:bg-white/20 dark:hover:bg-white/10 text-foreground",
        primary:
          "bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20",
        ghost: "hover:bg-white/15 dark:hover:bg-white/10 text-foreground",
        destructive:
          "bg-destructive/90 backdrop-blur-sm text-destructive-foreground hover:bg-destructive",
        outline:
          "border border-white/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/5 text-foreground backdrop-blur-sm",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(glassButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
