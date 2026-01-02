import React, { useEffect, useState } from 'react'
import "./pageStyles/Products.css";
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, removeErrors } from '../features/products/productSlice';
import { toast } from "react-toastify"
import { removeSearchKeyword } from "../features/products/productSlice"
import { BsFilterSquare } from "react-icons/bs";

import PageTitle from '../components/PageTitle';
import FilterSection from '../components/FilterSection';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Products() {

  const { searchKeyword, loading, products, currPage, isNextPage, isPrevPage, totalPages, error } = useSelector((state) => state.product);

  const categories = [
    "Electronics",
    "Clothing",
    "Footwear",
    "Home & Kitchen",
    "Furniture",
    "Books",
    "Beauty & Personal Care",
    "Health & Wellness",
    "Grocery",
    "Sports & Fitness",
    "Toys & Games",
    "Mobile Accessories",
    "Laptops & Computers",
    "Watches",
    "Jewelry",
    "Bags & Luggage",
    "Automotive",
    "Appliances",
    "Stationery",
    "Other",
  ]

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState({
    min: 0,
    max: 100000
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts({
      keyword: searchKeyword,
      category: selectedCategory,
      min: selectedPrice.min || 0,
      max: selectedPrice.max || 100000,
      limit: 8,
    }));
  }, [searchKeyword, selectedCategory, selectedPrice, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(removeSearchKeyword());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // console.log(error);
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  const handleFilterChange = (key, value) => {
    // console.log(key, value)
    if (key === "category") {
      setSelectedCategory(value);
    } else if (key === "price") {
      setSelectedPrice({
        min: value.min,
        max: value.max
      })
    }
  };

  const handlePageChange = (page) => {
    dispatch(getProducts({
      keyword: searchKeyword,
      category: selectedCategory,
      min: selectedPrice.min || 0,
      max: selectedPrice.max || 100000,
      page: page,
      limit: 8
    }));
  }

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilterOpen = () => {
    setIsFilterOpen(prev => {
      return !prev;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedPrice({ min: 0, max: 100000 });

    dispatch(getProducts({
      keyword: searchKeyword,
      page: 1,
      limit: 8
    }));
  }

  return (
    <>
      <PageTitle title="All Products" />
      <Navbar search={true} />
      <BsFilterSquare
        size={23}
        className='filter-icon'
        onClick={toggleFilterOpen}
      />

      <div className={`overlay ${isFilterOpen ? 'show' : ''}`} onClick={toggleFilterOpen}></div>

      <div className="products-layout">
        <div
          className={`filter-section ${isFilterOpen ? 'active' : ""}`}>
          <FilterSection
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearClick={clearAllFilters}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="product-section">
          <div className="products-product-container">
            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="no-products "> ⚠️ Products not found !</div>
            ) : (
              products.map(product => (
                <ProductCard product={product} key={product._id} />
              ))
            )}

          </div>

          {/* <div className="divider"></div> */}
          <Pagination
            currPage={currPage}
            isNextPage={isNextPage}
            isPrevPage={isPrevPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            priceRange={selectedPrice}
          />
        </div>

      </div>
      <Footer />
    </>
  )
}

export default Products