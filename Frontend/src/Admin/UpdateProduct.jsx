import React, { useEffect, useState } from "react";
import "./AdminStyles/UpdateProduct.css";

import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAdminSuccess,
  createProduct,
  removeAdminErrors,
  updateProduct,
} from "../features/Admin/adminSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails } from "../features/products/productSlice";

function UpdateProduct() {
  const { productId } = useParams();
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
    "Other"
  ];

  const { product } = useSelector(state => state.product);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: 0,
  });


  const { error, loading, success } = useSelector((state) => state.admin);

  const [files, setFiles] = useState([]); // actual file objects
  const [previews, setPreviews] = useState([]); // preview URLs
  const [oldImagesPreviews, setOldImagesPreviews] = useState([]); // preview URLs

  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Filter only jpg, jpeg, png
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const filteredFiles = selectedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (filteredFiles.length !== selectedFiles.length) {
      toast.warning("Some files were not allowed (only jpg, jpeg, png)");
    }

    setFiles(filteredFiles);

    const urls = filteredFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", productData.name);
    formData.set("price", Number(productData.price));
    formData.set("description", productData.description);
    formData.set("category", productData.category);
    formData.set("stock", Number(productData.stock));


    // Append multiple images (backend expects 'productImages')
    // if (files.length > 0) {
    //   files.forEach((file) => formData.append("productImages", file));
    // }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    dispatch(updateProduct({ productId, formData }));
  };

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeAdminErrors());
    }
  }, [error, dispatch]);

  // Show success toast
  useEffect(() => {
    if (success) {
      toast.success("Product updated successfully.");
      // Clear files and previews after success
      setProductData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: 0,
      });
      setFiles([]);
      setPreviews([]);
      setOldImagesPreviews([])
    }
  }, [success]);

  // Cleanup preview URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    if (productId) {
      dispatch(getProductDetails(productId))
    }
  }, [dispatch, productId])

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
      });

      const oldProductImages = product.productImages.map((img) => img.url);
      setOldImagesPreviews(oldProductImages);
    }
  }, [product]);


  return (
    <>
      <PageTitle title="Create Product" />
      <Navbar cartIconHide={true} />
      <div className="update-product-wrapper">
        <h1 className="update-product-title">Update Product</h1>

        <form
          className="update-product-form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <label htmlFor="name">Product Name: </label>
          <input
            id="name"
            type="text"
            name="name"
            className="update-product-input"
            value={productData?.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />

          <label htmlFor="price">Product Price: </label>
          <input
            id="price"
            type="number"
            name="price"
            className="update-product-input"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
          />

          <label htmlFor="description">Product Description: </label>
          <textarea
            id="description"
            type="text"
            name="description"
            className="update-product-textarea"
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
          />

          <label htmlFor="category">Product Category: </label>
          <select
            id="category"
            className="update-product-select"
            name="category"
            value={productData?.category}
            onChange={(e) =>
              setProductData({ ...productData, category: e.target.value })
            }
          >
            <option value="" disabled>
              Choose a Category
            </option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="stock">Product Stock: </label>
          <input
            id="stock"
            type="number"
            name="stock"
            className="update-product-input"
            required
            value={productData.stock}
            onChange={(e) => {
              const value = Number(e.target.value);

              // Prevent decreasing below current stock
              if (value < 0) {
                toast.warning("You cannot decrease stock");
                return;
              }

              setProductData({ ...productData, stock: value });
            }}
          />

          <div className="update-product-file-wrapper">
            <label htmlFor="image">Product Images: </label>
            <input
              id="image"
              type="file"
              name="productImages"
              accept='image/'
              className="update-product-file-input"
              multiple
              onChange={handleFileChange}
            />
            <p>{files.length} image selected</p>
          </div>

          <label>NewImages: </label>
          {
            previews.length > 0 &&
            <div className="update-product-preview-wrapper">
              {previews?.map((preview, idx) => (
                <img
                  src={preview}
                  alt={`Product Preview ${idx}`}
                  className="update-product-preview-image"
                  key={idx}
                />
              ))}
            </div>
          }

          <label>OldImages: </label>
          <div className="update-product-old-images-wrapper">
            {oldImagesPreviews?.map((preview, idx) => (
              <img
                src={preview}
                alt={`Old Product Preview ${idx}`}
                className="update-product-old-image"
                key={idx} />
            ))}

          </div>

          <button type="submit"
            className="update-product-submit-btn">
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </>
  );
}

export default UpdateProduct;
