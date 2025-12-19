import React from "react";
import "./componentStyles/Select.css";

const Select = ({ categories, onCategoryChange }) => {
  return (
    <select
      onChange={(e) => onCategoryChange(e.target.value)}
      className="category-select"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default Select;
