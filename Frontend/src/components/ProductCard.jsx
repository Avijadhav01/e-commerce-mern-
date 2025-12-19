import React, { useState } from 'react'
import "./componentStyles/ProductCard.css"
import { useNavigate } from 'react-router-dom';
import Rating from './Rating';


const ProductCard = ({ product }) => {

  const [rating, setRating] = useState(0);
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    // console.log(`rating changed to ${newRating}`);
  }

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-card">
        <img
          className='product-image'
          src={`${product?.productImages[0].url}`} alt="" />

        {/* Product Details */}
        <div className=' text-sm text-slate-800'>
          <div>
            <p className='title-price'>{product.name}
              <span className='price'>₹{product?.price}</span>
            </p>

            {/* Rating */}
            <div className="rating_container">
              <Rating
                value={product?.averageRating}
                onRatingChange={handleRatingChange}
                disabled={true}
              />
            </div>
            <span className='reviews'>
              ({product?.reviewsCount}{product?.reviewsCount === 1 ? " Review" : " Reviews"})
            </span>
            <button className='add-to-cart'>View</button>
          </div>


        </div>

      </div>
    </div>
  )
}

export default ProductCard;