import React from 'react'
import "./pageStyles/ProductDetails.css";
import Rating from '../components/Rating';
import { FaTrash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { deleteReview } from '../features/reviews/reviewSlice';

function Review({ review, userId, productId }) {


  const dispatch = useDispatch();
  const handleOnClick = () => {
    dispatch(deleteReview({ id: productId }));
  }

  return (
    <div className="review-item">
      {
        userId === review.userInfo._id ?
          (<div className='icons'>
            <FaTrash cursor="pointer" onClick={handleOnClick} />
          </div>) : null
      }
      <div className="review-header">
        <Rating value={review?.rating} disabled={true} />
      </div>
      <p className="review-comment">{review?.comment}</p>
      {userId !== review.userInfo._id ?
        <p className="review-name">- {review?.userInfo?.fullName}</p> : null
      }
    </div>
  )
}

export default Review