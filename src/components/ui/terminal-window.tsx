"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface TerminalWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  children: React.ReactNode;
}

const TerminalWindow = React.forwardRef<HTMLDivElement, TerminalWindowProps>(
  ({ className, children, title, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "border-terminal-border",
      primary: "border-primary",
      success: "border-success-DEFAULT",
      warning: "border-warning-DEFAULT",
      error: "border-destructive",
    };

    return (
      <div
        className={cn(
          "terminal-window",
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Terminal header */}
        <div className="terminal-header">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-destructive/80"></div>
            <div className="h-3 w-3 rounded-full bg-warning/80"></div>
            <div className="h-3 w-3 rounded-full bg-success/80"></div>
          </div>
          {title && (
            <div className="text-xs font-mono text-muted-foreground truncate">
              {title}
            </div>
          )}
          <div className="w-4"></div> {/* Spacer for alignment */}
        </div>

        {/* Terminal content */}
        <div className="terminal-content">
          {children}
          <div className="scan-line" />
        </div>
      </div>
    );
  }
);
TerminalWindow.displayName = "TerminalWindow";

export { TerminalWindow }; 