import React, { useEffect, useState } from 'react'
import "./pageStyles/ProductDetails.css";
import PageTitle from '../components/pageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, removeErrors } from '../../../../New folder/features/products/productSlice.js';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { toast } from "react-toastify"
import { createProductReview, getProductReviews, removeReviewErrors, removeReviewMessage } from '../../../../New folder/features/reviews/reviewSlice.js';
import { addItemToCart, removeMessage } from '../../../../New folder/features/cart/cartSlice.js';
import { removeErrors as cartRemoveErrors } from "../../../../New folder/features/cart/cartSlice.js"
import Review from '../components/Review.jsx';
import Pagination from '../components/Pagination.jsx';

function ProductDetails() {

  const { id } = useParams(); // <-- here is your product ID

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { loading: cartLoading, error: cartError, success, message } = useSelector(state => state.cart)
  const { product, error, loading } = useSelector((state) => state.product);
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
        limit: 2,
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
    if (reviewSuccess) {
      toast.success(reviewMessage);
      dispatch(removeReviewMessage());
    }
  }, [success, message, reviewSuccess, reviewMessage, dispatch]);

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
    if (userRating >= 1 && userComment.trim() !== "") {
      const data = {
        id: id,
        rating: userRating,
        comment: userComment
      }
      dispatch(createProductReview(data))
    }
  }

  useEffect(() => {
    if (reviewSuccess) {
      dispatch(getProductReviews({ id, page: 1, limit: 2 }));
      setUserComment("");
      setUserRating(0);
    }
  }, [reviewSuccess, id])


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

                  <div className="product-thumbnails">
                    <img src={product?.productImages[0]?.url} alt=""
                      className='thumbnail-image' />
                  </div>

                  <img src={`${product?.productImages[0]?.url}`}
                    alt={`${product?.name}`}
                    className="product-detail-image" />

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
                      <input type="text" value={quantity}
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
                  >
                  </textarea>
                  <button
                    type='submit'
                    className='submit-review-btn'>Submit Review</button>
                </form>
              </div>

              <div className="reviews-container" >
                <h3>Customer Reviews</h3>
                {
                  reviewLoading ? (
                    <Loader />
                  ) : reviews && reviews.length === 0 ? (
                    <p className="no-reviews">This product has no reviews yet.</p>
                  ) : reviews?.map((review, idx) => (
                    <Review review={review} key={idx} />
                  ))
                }

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