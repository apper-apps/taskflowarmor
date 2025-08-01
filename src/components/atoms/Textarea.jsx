import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "placeholder:text-gray-400 text-gray-900 bg-white",
        "transition-all duration-200 resize-none",
        "hover:border-gray-400",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;