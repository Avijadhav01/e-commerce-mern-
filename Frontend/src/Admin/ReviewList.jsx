import React, { useEffect } from 'react'
import "./AdminStyles/ReviewsList.css"

import { toast } from "react-toastify"
import { FaTrash } from "react-icons/fa";

import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";

import { useDispatch, useSelector } from 'react-redux';
import { clearAdminSuccess, adminDeleteReview, fetchAdminProducts, getAdminProductReviews } from '../features/Admin/adminSlice';


function ReviewList() {

  const {
    products,
    reviews,
    error,
    success,
    message
  } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [])

  useEffect(() => {
    if (success) {
      dispatch(fetchAdminProducts());
      toast.success(message);
      dispatch(clearAdminSuccess());
    }
  }, [success, message])

  const handleViewReviews = (productId) => {
    if (productId) {
      dispatch(getAdminProductReviews({ productId }));
    }
  }

  const handleDeleteReview = (reviewId) => {
    if (reviewId) {
      dispatch(adminDeleteReview(reviewId));
    }
  }

  if (!products || products.length === 0) {
    return (
      <div className="reviews-list-container">
        <h1 className="reviews-table-title">All Products</h1>
        <p>No products Found</p>
      </div>
    )
  }

  return (
    <>
      <Navbar cartIconHide={true} />
      <PageTitle title={"Product Reviews"} />
      <div className="reviews-list-container">
        <h1 className="reviews-table-title">All Products</h1>
        <table className='reviews-table'>
          <thead>
            <tr>
              <th>SN</th>
              <th>Product Name</th>
              <th>Product Image</th>
              <th>No Of Reviews</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              products?.map((product, idx) => (
                <tr key={product?._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{product?.name}</td>
                  <td>
                    <img
                      className='review-product-image'
                      src={product?.
                        productImages[0]?.url} alt={product?.name} />
                  </td>
                  <td>{product?.reviewsCount}</td>
                  <td>
                    <button
                      className={`action-btn view-btn ${product?.reviewsCount === 0 ? "hide" : ""}`}
                      onClick={() => handleViewReviews(product?._id)}>
                      View Reviews
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <div className="reviews-details">
          <h2>Reviews for Product</h2>
          <table className='reviews-table'>
            <thead>
              <tr>
                <th>SN</th>
                <th>Reviewer Name</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                reviews?.map((review, idx) => (
                  <tr key={review?._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{review?.userInfo?.fullName}</td>
                    <td>{review?.rating}</td>
                    <td>{review?.comment}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteReview(review?._id)}
                        className="action-btn delete-btn">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ReviewList;