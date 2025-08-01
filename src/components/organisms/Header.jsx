import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { AuthContext } from "../../App";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  return (
    <div className="flex items-center space-x-3">
      {user && (
        <span className="text-sm text-gray-600">
          {user.firstName} {user.lastName}
        </span>
      )}
      <button
        onClick={logout}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ApperIcon name="LogOut" className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};
const Header = ({ searchQuery, onSearchChange }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Board View";
      case "/list":
        return "List View";
      case "/projects":
        return "Projects";
      default:
        return "TaskFlow Pro";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
              <p className="text-sm text-gray-500">{getPageTitle()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-80">
            <SearchBar 
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search tasks and projects..."
            />
          </div>
          
<div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Settings" className="w-5 h-5" />
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;