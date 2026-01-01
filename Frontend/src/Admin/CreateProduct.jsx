import React, { useEffect, useState } from "react";
import "./AdminStyles/CreateProduct.css";

import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAdminSuccess,
  createProduct,
  removeAdminErrors,
} from "../features/Admin/adminSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
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

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const { error, loading, success } = useSelector((state) => state.admin);

  const [files, setFiles] = useState([]); // actual file objects
  const [previews, setPreviews] = useState([]); // preview URLs

  const dispatch = useDispatch();
  const navigate = useNavigate()

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

    if (!files.length) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    formData.set("name", productData.name);
    formData.set("price", productData.price);
    formData.set("description", productData.description);
    formData.set("category", productData.category);
    formData.set("stock", productData.stock);

    // Append multiple images (backend expects 'productImages')
    files.forEach((file) => formData.append("productImages", file));

    dispatch(createProduct(formData));
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
      toast.success("Product created successfully.");
      // Clear files and previews after success
      setFiles([]);
      setPreviews([]);
      navigate("/admin/products");
    }
  }, [success]);

  // Auto-clear success state
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearAdminSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Cleanup preview URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <>
      <PageTitle title="Create Product" />
      <Navbar cartIconHide={true} />
      <div className="create-product-container">
        <h1 className="form-title">Create Product</h1>

        <form
          className="product-form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Enter Product Name"
            className="form-input"
            required
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />

          <input
            type="number"
            name="price"
            placeholder="Enter Product Price"
            className="form-input"
            required
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
          />

          <input
            type="text"
            name="description"
            placeholder="Enter Product Description"
            className="form-input"
            required
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
          />

          <select
            className="form-select"
            name="category"
            required
            value={productData.category}
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

          <input
            type="number"
            name="stock"
            placeholder="Enter Product Stock"
            className="form-input"
            required
            value={productData.stock}
            onChange={(e) =>
              setProductData({ ...productData, stock: e.target.value })
            }
          />

          <div className="file-input-container">
            <input
              type="file"
              name="productImages"
              accept='image/'
              className="form-input-file"
              multiple
              onChange={handleFileChange}
            />
            <div>{files.length} image(s) selected</div>
          </div>

          <div className="image-preview-container">
            {previews.map((preview, idx) => (
              <img
                src={preview}
                alt={`Product Preview ${idx}`}
                className="image-preview"
                key={idx}
              />
            ))}
          </div>

          <button type="submit" className="submit-btn">
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateProduct;
