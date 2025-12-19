import React from 'react'
import "../pages/pageStyles/ProductDetails.css";
import Rating from './Rating';

function Review({ review }) {
  return (
    <div className="review-section" >
      <div className="review-item">
        <div className="review-header">
          <Rating value={review?.rating} disabled={true} />
        </div>
        <p className="review-comment">{review?.comment}</p>
        <p className="review-name">By- {review?.userInfo?.fullName}</p>
      </div>
    </div>
  )
}

export default Review