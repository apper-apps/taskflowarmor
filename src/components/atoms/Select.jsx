import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "text-gray-900 bg-white cursor-pointer",
        "transition-all duration-200",
        "hover:border-gray-400",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;