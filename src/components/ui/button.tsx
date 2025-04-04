import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-mono rounded-sm text-sm whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow-sm shadow-primary hover:shadow-glow hover:shadow-primary border border-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground shadow-glow-sm shadow-secondary hover:shadow-glow hover:shadow-secondary border border-secondary/30",
        accent:
          "bg-accent text-accent-foreground shadow-glow-sm shadow-accent hover:shadow-glow hover:shadow-accent border border-accent/30",
        destructive:
          "bg-destructive text-destructive-foreground shadow-glow-sm shadow-destructive hover:shadow-glow hover:shadow-destructive border border-destructive/30",
        outline:
          "border border-primary text-foreground bg-transparent hover:shadow-glow-sm hover:shadow-primary",
        terminal:
          "bg-terminal-background border border-terminal-border text-terminal-text hover:shadow-glow-sm hover:shadow-terminal-text relative overflow-hidden",
        ghost:
          "hover:bg-muted hover:text-foreground",
        link:
          "text-primary hover:text-primary/80 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants }; 