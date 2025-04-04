"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const toggleGroupVariants = cva(
  "inline-flex bg-terminal-background border border-terminal-border rounded-md p-1 font-mono text-sm",
  {
    variants: {
      variant: {
        default: "bg-terminal-background",
        outline: "bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleGroupVariants>
>(({ className, variant, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(toggleGroupVariants({ variant }), className)}
    {...props}
  />
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const toggleGroupItemVariants = cva(
  "inline-flex items-center justify-center px-3 py-2 rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 
          "data-[state=on]:bg-primary/20 data-[state=on]:text-primary data-[state=on]:shadow-[0_0_5px] data-[state=on]:shadow-primary hover:text-primary/80",
        outline: 
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted hover:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleGroupItemVariants>
>(({ className, variant, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleGroupItemVariants({ variant }), className)}
    {...props}
  />
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem }; 