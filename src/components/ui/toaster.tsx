"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      closeButton
      richColors
      className="font-mono"
      toastOptions={{
        classNames: {
          toast:
            "terminal-window group terminal-content border-terminal-border bg-terminal-background text-terminal-text text-sm relative",
          title: "text-terminal-text font-mono",
          description: "text-terminal-text/80 font-mono text-xs",
          actionButton:
            "bg-primary text-primary-foreground shadow-glow-sm shadow-primary hover:shadow-glow hover:shadow-primary border border-primary/30",
          cancelButton:
            "bg-muted text-muted-foreground border border-muted hover:bg-muted/80",
          success:
            "group-[]:border-success-DEFAULT group-[]:text-success-DEFAULT",
          error: "group-[]:border-destructive group-[]:text-destructive-DEFAULT",
          warning: "group-[]:border-warning-DEFAULT group-[]:text-warning-DEFAULT",
        },
      }}
    />
  );
} 