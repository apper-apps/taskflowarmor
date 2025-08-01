import React from "react";
import { cn } from "@/utils/cn";

const ProjectColorPicker = ({ selectedColor, onColorChange }) => {
  const colors = [
    { name: "blue", class: "bg-blue-500" },
    { name: "green", class: "bg-green-500" },
    { name: "purple", class: "bg-purple-500" },
    { name: "pink", class: "bg-pink-500" },
    { name: "red", class: "bg-red-500" },
    { name: "yellow", class: "bg-yellow-500" },
    { name: "indigo", class: "bg-indigo-500" },
    { name: "teal", class: "bg-teal-500" }
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() => onColorChange(color.name)}
          className={cn(
            "w-6 h-6 rounded-full border-2 transition-all duration-200",
            color.class,
            selectedColor === color.name 
              ? "border-gray-900 scale-110" 
              : "border-gray-300 hover:border-gray-400"
          )}
        />
      ))}
    </div>
  );
};

export default ProjectColorPicker;