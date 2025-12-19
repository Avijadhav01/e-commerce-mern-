import React, { useEffect, useState } from 'react'
import "./pageStyles/Products.css";
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, removeErrors } from '../../../../New folder/features/products/productSlice';
import { toast } from "react-toastify"
import { unSetSearchKeyword } from "../../../../New folder/features/products/productSlice"
import { BsFilterSquare } from "react-icons/bs";

import FilterSection from '../components/FilterSection';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import PageTitle from '../components/pageTitle';

function Products() {

  const { searchKeyword, loading, products, currPage, isNextPage, isPrevPage, totalPages, error } = useSelector((state) => state.product);

  const categories = ["Electronics", "Clothes", "Shoes", "Mobiles", "Vehicle", "Bags", "Makeup"];
  const brands = ["Nike", "Adidas", "Puma"];


  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState("Male");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts({ keyword: searchKeyword, category: selectedCategory, limit: 8 }));
  }, [dispatch, searchKeyword, selectedCategory]);

  useEffect(() => {
    if (error) {
      console.log(error);
      // toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  const handleFilterChange = (key, value) => {
    if (key === "category") {
      setSelectedCategory(value);
    } else if (key === "price") {
      setSelectedPrice(value);
    }
  };


  const handlePageChange = (page) => {
    dispatch(getProducts({ keyword: searchKeyword, category: selectedCategory, page: page, limit: 8 }));
  }

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilterOpen = () => {
    setIsFilterOpen(prev => {
      return !prev;
    });
  };


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
            brands={brands}
            selectedGender={selectedGender}
            onFilterChange={handleFilterChange}
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
          <div className="divider"></div>
          <Pagination
            currPage={currPage}
            isNextPage={isNextPage}
            isPrevPage={isPrevPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

    </>
  )
}

export default Products