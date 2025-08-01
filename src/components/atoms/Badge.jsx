import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    high: "priority-high text-white",
    medium: "priority-medium text-white", 
    low: "priority-low text-white",
    todo: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    done: "bg-green-100 text-green-800"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;