import React from "react";
import "./componentStyles/FilterSection.css";

function FilterSection({
  categories = [],
  selectedCategory,
  selectedGender,
  onFilterChange,
}) {
  return (
    <div className="product-filters">

      {/* CATEGORY */}
      <div className="filter-group category-filter">
        <label className="filter-label">Category</label><br />
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="">All</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* GENDER (Radio) */}
      <div className="filter-group gender-filter">
        <label className="filter-label">Gender</label>
        <div className="filter-options radio-group">
          {["Men", "Women", "Unisex"].map((g) => (
            <label key={g} className="filter-option-label">
              <input
                type="radio"
                className="filter-radio"
                name="gender"
                value={g}
                checked={selectedGender === g}
                onChange={() => onFilterChange("gender", g)}
              />
              {g}
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}

export default FilterSection;
