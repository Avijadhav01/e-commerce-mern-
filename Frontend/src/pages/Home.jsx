import React, { useEffect } from 'react'
import "./pageStyles/Home.css"

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import ProductCard from '../components/ProductCard';
import PageTitle from '../components/pageTitle';
import { useSelector, useDispatch } from "react-redux"
import { getProducts, removeErrors } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { toast } from "react-toastify"
import Pagination from '../components/Pagination';

function Home() {

  const { loading, products, currPage, isNextPage, isPrevPage, totalPages, error } = useSelector((state) => state.product);

  // console.log(error);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts({ limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  const handlePageChange = (page) => {
    dispatch(getProducts({ page: page, limit: 10 }));
  }

  return (
    <>
      <PageTitle title="Home -My Website " />
      <Navbar search={true} />
      <ImageSlider />
      <div className='home-container'>
        <h2 className='home-heading'>Trending Now</h2>
        <div className="divider"></div>
        <div className="home-product-container">
          {
            loading ? <Loader /> : (
              products.map((product, idx) => (
                <ProductCard product={product} key={idx} />
              ))
            )
          }
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
      <Footer />
    </>
  )
}

export default Home;