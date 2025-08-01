import React from "react";
import Select from "@/components/atoms/Select";

const PrioritySelector = ({ value, onChange }) => {
  return (
    <Select value={value} onChange={onChange}>
      <option value="">Select Priority</option>
      <option value="low">Low Priority</option>
      <option value="medium">Medium Priority</option>
      <option value="high">High Priority</option>
    </Select>
  );
};

export default PrioritySelector;