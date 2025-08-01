import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import TaskCard from "@/components/organisms/TaskCard";

const KanbanColumn = ({ 
  title, 
  status, 
  tasks, 
  projects, 
  onTaskEdit, 
  onTaskDelete, 
  onTaskMove,
  icon,
  color 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    onTaskMove(taskId, status);
  };

  const getProject = (projectId) => {
    return projects.find(p => p.Id === projectId);
  };

  return (
    <div
      className={`kanban-column flex-1 bg-gray-50 rounded-lg p-4 min-h-[600px] ${
        isDragOver ? "drag-over" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name={icon} className={`w-5 h-5 ${color}`} />
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            project={getProject(task.projectId)}
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
            onMove={onTaskMove}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;