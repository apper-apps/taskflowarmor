import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const TaskCard = ({ task, project, onEdit, onDelete, onMove, draggable = true }) => {
  const handleDragStart = (e) => {
    if (draggable) {
      e.dataTransfer.setData("text/plain", task.Id.toString());
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-400";
    }
  };

  const getProjectColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      indigo: "bg-indigo-500",
      teal: "bg-teal-500"
    };
    return colorMap[color] || "bg-gray-500";
  };

  return (
    <div
      className="task-card bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
          {task.title}
        </h3>
        <div className="flex items-center space-x-1">
          <ApperIcon 
            name="AlertCircle" 
            className={`w-4 h-4 ${getPriorityColor(task.priority)}`}
          />
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="Edit2" className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(task.Id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <ApperIcon name="Trash2" className="w-3 h-3" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {project && (
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getProjectColorClass(project.color)}`} />
              <span className="text-xs text-gray-500">{project.name}</span>
            </div>
          )}
          {task.priority && (
            <Badge variant={task.priority}>
              {task.priority}
            </Badge>
          )}
        </div>

        {task.dueDate && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>{format(new Date(task.dueDate), "MMM d")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;