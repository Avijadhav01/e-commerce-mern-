import React, { useEffect } from 'react'
import "./AdminStyles/ProductsList.css"


import Navbar from "../components/Navbar"
import PageTitle from "../components/PageTitle"
import Loader from "../components/Loader"
import Pagination from "../components/Pagination"

import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAdminSuccess, deleteProduct, fetchAdminProducts, removeAdminErrors } from '../features/Admin/adminSlice';
import { toast } from "react-toastify"
function ProductList() {

  const {
    loading,
    products,
    error,
    message,
    success,
    currPage,
    isNextPage,
    isPrevPage,
    totalPages
  } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeAdminErrors());
    }
  }, [error, dispatch])

  useEffect(() => {
    dispatch(fetchAdminProducts({ page: 1, limit: 10 }));
  }, [dispatch])

  useEffect(() => {
    if (success) {
      toast.success(message);
      // dispatch(fetchAdminProducts());
      dispatch(clearAdminSuccess());
    }
  }, [success, dispatch])

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
    }
  }

  const handlePageChange = (page) => {
    dispatch(fetchAdminProducts({ page: page, limit: 10 }));
  }

  const emptyRows = 10 - (products?.length || 0);
  return (
    <>
      <Navbar cartIconHide={true} />
      <PageTitle title={"Admin Products"} />
      <h1 className="product-list-title">All Products</h1>
      {
        loading ? <Loader /> :
          (
            <div className="product-list-container">
              <table className='product-table'>
                <thead>
                  <tr>
                    <th>S1 No</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    products && products.map((product, idx) => (
                      <tr key={product?._id}>
                        <td>{idx + 1}</td>
                        <td>
                          <img
                            className='admin-product-image'
                            src={`${product?.productImages[0]?.url}`} alt="Product" />
                        </td>
                        <td>{product?.name}</td>
                        <td>₹{product?.price}</td>
                        <td>{product?.averageRating}</td>
                        <td>{product?.category}</td>
                        <td>{product?.stock}</td>
                        <td>{product?.createdAt.slice(0, 10).split("-").reverse().join("-")}</td>
                        <td>
                          <Link
                            to={`/admin/product/${product?._id}`}
                            className='action-icon edit-icon'>
                            <FaEdit />
                          </Link>

                          <button
                            className="action-icon delete-icon"
                            onClick={() => handleDelete(product?._id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  }

                  {/* 👇 EMPTY ROWS TO PREVENT STRETCHING */}
                  {Array.from({ length: emptyRows }).map((_, index) => (
                    <tr key={`empty-${index}`} className="empty-row">
                      <td colSpan="9"></td>
                    </tr>
                  ))}


                </tbody>
              </table>
              <Pagination
                currPage={currPage}
                isNextPage={isNextPage}
                isPrevPage={isPrevPage}
                onPageChange={handlePageChange}
                totalPages={totalPages}
              />
            </div>
          )
      }
    </>
  )
}

export default ProductList;