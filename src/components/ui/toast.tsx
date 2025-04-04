"use client";

import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  message: string;
  type?: "default" | "success" | "error" | "warning";
};

export function toast({ title, message, type = "default" }: ToastProps) {
  const displayTitle = title || (
    type === "success" ? "Operation Successful" :
    type === "error" ? "Error Detected" :
    type === "warning" ? "Warning" :
    "System Notification"
  );

  if (type === "success") {
    return sonnerToast.success(displayTitle, { description: message });
  } else if (type === "error") {
    return sonnerToast.error(displayTitle, { description: message });
  } else if (type === "warning") {
    return sonnerToast.warning(displayTitle, { description: message });
  } else {
    return sonnerToast(displayTitle, { description: message });
  }
} 