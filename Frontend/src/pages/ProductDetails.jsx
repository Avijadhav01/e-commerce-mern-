import React, { useEffect, useState } from 'react'
import "./pageStyles/ProductDetails.css";

import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import Pagination from '../components/Pagination.jsx';

import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, removeErrors } from '../features/products/productSlice.js';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { toast } from "react-toastify"
import {
  createProductReview,
  getProductReviews,
  removeReviewErrors,
  clearReviewSuccess,
} from '../features/reviews/reviewSlice.js';

import { addItemToCart, removeMessage } from '../features/cart/cartSlice.js';
import { removeErrors as cartRemoveErrors } from "../features/cart/cartSlice.js"
import Review from './Review.jsx';

function ProductDetails() {

  const { id } = useParams(); // <-- here is your product ID

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { loading: cartLoading, error: cartError, success, message } = useSelector(state => state.cart)
  const { product, error, loading } = useSelector((state) => state.product);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (product) {
      setSelectedImage(product?.productImages[0]?.url || "")
    }
  }, [product])

  const {
    reviews,
    loading: reviewLoading,
    error: reviewError,
    currPage,
    isNextPage,
    isPrevPage,
    totalPages,
    success: reviewSuccess,
    message: reviewMessage
  } = useSelector((state) => state.review);

  const dispatch = useDispatch();

  // for product details and review
  useEffect(() => {
    if (id) {
      const data = {
        id: id,
        page: 1,
        limit: 4,
      }
      dispatch(getProductDetails(id));
      dispatch(getProductReviews(data));
    }
  }, [dispatch, id])

  // for success
  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(removeMessage());
    }
  }, [success, message, dispatch]);

  useEffect(() => {
    if (reviewSuccess) {
      console.log(reviews);
      if (id) {
        dispatch(getProductReviews({ id, page: 1, limit: 4 }));
      }
      setUserComment("");
      setUserRating(0);
      toast.success(reviewMessage)
      dispatch(clearReviewSuccess());
    }
  }, [reviewSuccess, reviewMessage, id, dispatch]);

  // For error
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
    if (cartError) {
      toast.error(cartError);
      dispatch(cartRemoveErrors());
    }
    if (reviewError) {
      toast.error(reviewError);
      dispatch(removeReviewErrors());
    }
  }, [error, cartError, reviewError, dispatch])

  const increaseQuantity = () => {
    if (quantity >= product?.stock) {
      toast.error("Quantity can not exceed available stock");
      return
    }
    setQuantity((prev) => prev + 1);
  }

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("Quantity cannot be less than 1");
      return
    }
    setQuantity((prev) => prev - 1);
  }

  const addToCart = () => {
    if (quantity > product?.stock) {
      toast.error("Quantity cannot exceed available stock");
      return;
    }
    dispatch(addItemToCart({ id, quantity }))
  }

  const handlePageChange = (page) => {
    dispatch(getProductReviews({ id: id, page: page, limit: 2 }));
  }

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (userRating >= 1 && userComment.trim() !== "") {
      const data = {
        id: id,
        rating: userRating,
        comment: userComment
      }
      dispatch(createProductReview(data));
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      <PageTitle title='Product - Details' />
      <Navbar search={false} />
      <div className="product-details-container">
        {
          loading || !product ? <Loader /> :
            (<>
              <div className="product-detail-container">

                <div className="product-image-container">
                  <img src={`${selectedImage || product?.productImages[0]?.url}`}
                    alt={`${product?.name}`}
                    className="product-detail-image" />
                  {
                    product?.productImages?.length > 1 &&
                    <div className="product-thumbnails">
                      {
                        product?.productImages?.map((img, idx) => (
                          <img
                            src={img?.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className={`thumbnail-image ${selectedImage === img?.url ? "selected" : ""}`}
                            key={idx}
                            onClick={() => setSelectedImage(img?.url)} />
                        ))
                      }
                    </div>
                  }
                </div>

                <div className="product-info">
                  <div className='product-name'>
                    <h2>{product?.name}</h2>
                    ₹ {product?.price}
                  </div>
                  <p className='product-description'>{product?.description}</p>
                  <div className="product-rating">
                    <Rating
                      value={product.averageRating}
                      disabled={true}
                    />
                    <span className='productCardSpan'>{product?.reviewsCount} {product?.reviewsCount > 1 ? ` Reviews` : ` Review`}</span>
                  </div>

                  <div className={`stock-status`}>
                    <span className={product?.stock > 0 ? `in-stock` : `out-of-stock`}>
                      {product?.stock > 0 ? (`In Stock (${product.stock} available)`) : (`Out of stock`)}
                    </span>
                  </div>

                  {product?.stock > 0 ?
                    (<div className="quantity-controls">
                      <span className="quantity-lable">Quantity:</span>
                      <button className='quantity-button' onClick={decreaseQuantity}>
                        -
                      </button>
                      <input type="number" value={quantity}
                        className='quantity-value' readOnly
                      />
                      <button className='quantity-button' onClick={increaseQuantity}>
                        +
                      </button>
                    </div>) : null}

                  <button
                    className="add-to-cart-btn"
                    disabled={product?.stock <= 0 || cartLoading}
                    onClick={addToCart}>
                    {cartLoading ? "Loading" : `ADD TO CART`}
                  </button>

                </div>
              </div>

              <div className="review-container">
                <form
                  onSubmit={handleReviewSubmit}
                  className='review-form'>
                  <h3>Write a Review</h3>
                  <Rating
                    value={userRating}
                    disabled={false}
                    onRatingChange={handleRatingChange}
                  />
                  <textarea
                    value={userComment}
                    placeholder='Write your review here..'
                    className='review-input'
                    onChange={(e) => setUserComment(e.target.value)}
                    autoFocus={false}
                  >
                  </textarea>
                  <button
                    type="submit"
                    className="submit-review-btn"
                    disabled={userRating === 0 || !userComment.trim()}
                  >
                    Submit Review
                  </button>

                </form>
              </div>

              <div className="reviews-container" >
                <h3>Customer Reviews</h3>
                <div className="review-section" >
                  {
                    reviews && reviews.length === 0 ? (
                      <p className="no-reviews">This product has no reviews yet.</p>
                    ) :
                      reviews?.map((review) => (
                        <Review
                          review={review}
                          userId={user?._id}
                          productId={product?._id}
                          key={review._id} />
                      ))
                  }
                </div>
              </div>
              <Pagination
                currPage={currPage}
                isNextPage={isNextPage}
                isPrevPage={isPrevPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>)
        }
      </div>
      <Footer />
    </>
  )
}

export default ProductDetails;