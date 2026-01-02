import React, { useState } from 'react'
import "./componentStyles/ProductCard.css"
import { useNavigate } from 'react-router-dom';
import Rating from './Rating';


const ProductCard = ({ product }) => {

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-card-container">
        <img
          className='product-image'
          src={`${product?.productImages[0].url}`} alt="" />

        {/* Product Details */}
        <div className=''>
          <div>

            <p className='title-price-cont'>
              <span className='product-name-cart'>{product.name}</span>
              <span className='price'>₹{product?.price}</span>
            </p>
            {/* Rating */}
            <div className="rating_container">
              <Rating
                value={product?.averageRating}
                disabled={true}
              />
            </div>
            <span className='reviews-count'>
              ({product?.reviewsCount}{product?.reviewsCount === 1 ? " Review" : " Reviews"})
            </span>
            <button className='product-view'>View</button>
          </div>


        </div>

      </div>
    </div>
  )
}

export default ProductCard;