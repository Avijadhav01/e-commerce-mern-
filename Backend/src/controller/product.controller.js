import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Product } from "../models/product.model.js";
import {
  uploadOnCloudinary,
  deleteImagesFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import { isValidObjectId } from "mongoose";

// 1️⃣ Create Product
const createProduct = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError("Product data is required", 400);
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user ID", 400);
  }

  // Upload all images to Cloudinary
  const uploadedImages = await Promise.all(
    req.files.map((file) => uploadOnCloudinary(file.path, "product_images"))
  );

  const product = await Product.create({
    ...req.body,
    productImages: uploadedImages,
    owner: userId,
  });

  if (!product) {
    throw new ApiError("Product not found", 404);
  }
  console.log("\nProduct created successfully.");

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// 2️⃣ Get All Products
const getAllProducts = AsyncHandler(async (req, res) => {
  // 1) Get all query fields
  const {
    page = 1,
    limit = 10,
    keyword,
    category,
    minPrice,
    maxPrice,
  } = req.query;

  // 2) Build filter Object
  const filters = {};
  if (category) filters.category = category;
  if (minPrice) filters.price = { $gte: Number(minPrice) };
  if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };

  // 3) Build aggregation pipeline
  const aggregate = Product.aggregate([]);

  aggregate
    // 1️⃣ Filter & search
    .match({
      ...filters,
      ...(keyword && { name: { $regex: keyword, $options: "i" } }),
    })
    // 2️⃣ Optional: join related collections (e.g., owner details) if needed
    // .lookup({...})

    // 4️⃣ Sort newest first
    .sort({
      createdAt: -1,
    });

  // 4) Execute aggregation with pagination
  const fetchedProducts = await Product.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  // 5) Handle empty result
  if (!fetchedProducts.docs.length) {
    return res.status(404).json(new ApiResponse(404, {}, "No products found"));
  }

  // 6) Send response
  return res
    .status(200)
    .json(
      new ApiResponse(200, fetchedProducts, "Products fetched successfully")
    );
});

// 3️⃣ Update Product
const updateProduct = AsyncHandler(async (req, res) => {
  const productId = req.params?.id;

  if (!productId) {
    throw new ApiError("Please provide a valid product ID", 400);
  }

  delete req.body._id;

  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw new ApiError("Product not found", 404);
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

// 4️⃣ Delete Product
const deleteProduct = AsyncHandler(async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    throw new ApiError("Please provide a valid product ID", 400);
  }

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    throw new ApiError("Product not found", 404);
  }

  // 2️⃣ Extract all public_ids (if any)
  const publicIds =
    deletedProduct.productImages?.map((img) => img.public_id) || [];

  // 3️⃣ Delete images from Cloudinary
  await deleteImagesFromCloudinary(publicIds);
  console.log("Product deleted successfully.");

  res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, "Product deleted successfully"));
});

// 5️⃣ Get Product By ID
const getProductById = AsyncHandler(async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    throw new ApiError("Please provide a valid product ID", 400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// 7️⃣ Admin - getting all products

const getAdminProducts = AsyncHandler(async (req, res) => {
  const products = await Product.find();
  if (!products || !products.length) {
    throw new ApiError(
      "Products not availabel, please add products first",
      400
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalProducts: products.length,
        products,
      },
      "All products fetched successfully"
    )
  );
});

export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getAdminProducts,
};
