import React, { useState } from 'react'
import "./componentStyles/Rating.css";
import { FaStar } from "react-icons/fa";

function Rating({ value, onRatingChange, disabled }) {

  const [selectedRating, setSelectedRating] = useState(value || 0);

  // Handle click
  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating);
      if (onRatingChange) {
        onRatingChange(rating)
      }
    }
  }

  // function to generate the stars based on the selected rating

  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= selectedRating;
      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? 'filled' : "empty"}`}
          onClick={() => handleClick(i)}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
          <FaStar />
        </span>
      )
    }
    return stars;
  }

  return (
    <div>
      <div className="rating">
        {generateStars()}
      </div>
    </div>
  )
}

export default Rating;