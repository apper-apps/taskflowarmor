import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No tasks yet", 
  description = "Create your first task to get started with organizing your work.",
  actionLabel = "Create Task",
  onAction,
  icon = "CheckSquare"
}) => {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} className="w-10 h-10 text-primary-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <Button onClick={onAction} size="lg">
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;