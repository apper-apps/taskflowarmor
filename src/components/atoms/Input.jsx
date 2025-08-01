import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "placeholder:text-gray-400 text-gray-900 bg-white",
        "transition-all duration-200",
        "hover:border-gray-400",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;