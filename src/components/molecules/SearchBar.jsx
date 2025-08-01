import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ value, onChange, placeholder = "Search tasks..." }) => {
  return (
    <div className="relative">
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
      />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-4"
      />
    </div>
  );
};

export default SearchBar;