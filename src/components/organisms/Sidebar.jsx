import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Sidebar = ({ projects, onCreateProject, onCreateTask }) => {
  const navigationItems = [
    { to: "/", icon: "LayoutGrid", label: "Board View" },
    { to: "/list", icon: "List", label: "List View" },
    { to: "/projects", icon: "Folder", label: "Projects" }
  ];

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
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col min-h-0 pt-6 pb-4">
          <div className="px-6 mb-6">
            <Button 
              onClick={onCreateTask}
              className="w-full"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-nav-item group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? "active text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                <ApperIcon name={item.icon} className="mr-3 w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Projects</h3>
              <button
                onClick={onCreateProject}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.Id}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${getProjectColorClass(project.color)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {project.taskCount} tasks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Quick Stats
              </h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total Projects</span>
                  <span className="font-medium">{projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Tasks</span>
                  <span className="font-medium">
                    {projects.reduce((sum, p) => sum + p.taskCount, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden fixed inset-0 z-50 flex transform translate-x-full transition-transform duration-300 ease-in-out">
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <ApperIcon name="X" className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="px-4 mb-6">
              <Button 
                onClick={onCreateTask}
                className="w-full"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>

            <nav className="px-2 space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="mr-4 w-6 h-6" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-14"></div>
      </div>
    </>
  );
};

export default Sidebar;