import React, { useState } from "react";
import "./componentStyles/FilterSection.css";

const MAX_PRICE = 100000;
const GAP = 1000;

function FilterSection({
  categories = [],
  priceRange = { min: 0, max: MAX_PRICE },
  onFilterChange,
  onClearClick,
  selectedCategory = ""
}) {

  const [min, setMin] = useState(priceRange.min);
  const [max, setMax] = useState(priceRange.max);

  const handleMin = (e) => {
    const value = Math.min(Number(e.target.value), max - GAP);
    setMin(value);
    onFilterChange("price", { min: value, max });
  };

  const handleMax = (e) => {
    const value = Math.max(Number(e.target.value), min + GAP);
    setMax(value);
    onFilterChange("price", { min, max: value });
  };

  const onClick = () => {
    setMin(0);
    setMax(MAX_PRICE);
    onClearClick();
  }

  return (
    <div className="product-filters">

      <button className="clear-all-btn"
        onClick={onClick}>
        Clear All
      </button>

      {/* CATEGORY */}
      <div className="filter-group category-filter">
        <label className="filter-label">CATEGORY</label><br />
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="">All</option>
          {
            categories.map((cat, i) => (
              <option
                className="category-options"
                key={i}
                value={cat}>
                {cat}
              </option>
            ))
          }
        </select>
      </div>

      {/* PRICE FILTER */}
      <div className="price-filter">
        <label className="filter-label">PRICE</label>

        <div className="slider-container">
          <div
            className="slider-track"
            style={{
              background: `linear-gradient(
                to right,
                #ddd ${(min / MAX_PRICE) * 100}%,
                #2563eb ${(min / MAX_PRICE) * 100}%,
                #2563eb ${(max / MAX_PRICE) * 100}%,
                #ddd ${(max / MAX_PRICE) * 100}%
              )`,
            }}
          />
          <input type="range" min="0" max={MAX_PRICE} value={min} onChange={handleMin} />
          <input type="range" min="0" max={MAX_PRICE} value={max} onChange={handleMax} />
        </div>

        <div className="price-values">
          <span>₹ {min}</span>
          <span>to</span>
          <span>₹ {max}</span>
        </div>
      </div>

    </div>
  );
}

export default FilterSection;
