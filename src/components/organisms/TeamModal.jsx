import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ProjectColorPicker from "@/components/molecules/ProjectColorPicker";

const TeamModal = ({ isOpen, onClose, team, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "blue"
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        color: team.color || "blue"
      });
    } else {
      setFormData({
        name: "",
        color: "blue"
      });
    }
  }, [team, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onSave(formData);
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {team ? "Edit Team" : "Create New Team"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <Input
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Enter team name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Team Color
            </label>
            <ProjectColorPicker
              selectedColor={formData.color}
              onColorChange={handleColorChange}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {team ? "Update Team" : "Create Team"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;