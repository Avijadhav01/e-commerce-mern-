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
  const uploadedImages = [];

  for (const file of req.files) {
    const result = await uploadOnCloudinary(file.path, "product_images");
    uploadedImages.push(result);
  }

  const product = await Product.create({
    ...req.body,
    productImages: uploadedImages,
    owner: userId,
  });

  if (!product) {
    throw new ApiError("Product not found", 404);
  }
  // console.log("\nProduct created successfully.");

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// 2️⃣ Get All Products
const getAllProducts = AsyncHandler(async (req, res) => {
  // 1) Get all query fields
  const { page = 1, limit = 10, keyword, category, min, max } = req.query;

  // 2) Build filter Object
  const filters = {};
  if (category) filters.category = category;
  if (min) filters.price = { $gte: Number(min) };
  if (max) filters.price = { ...filters.price, $lte: Number(max) };

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
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  const oldImagesPublicId =
    product?.productImages?.map((img) => img.public_id) || [];

  // 2. Prevent _id modification
  delete req.body?.productId;

  // 3. Handle images safely
  let uploadedImages = [];

  if (req.files && req.files.length > 0) {
    uploadedImages = await Promise.all(
      req.files.map((file) => uploadOnCloudinary(file.path, "product_images"))
    );
  }

  // 4. Check empty update (body + images)
  if (Object.keys(req.body).length === 0 && uploadedImages.length === 0) {
    throw new ApiError("No data provided to update", 400);
  }

  // 5. Whitelist allowed fields
  const allowedFields = ["name", "price", "description", "category", "stock"];

  const updateData = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updateData[key] = req.body[key];
    }
  }

  // 6. Update images only if uploaded
  if (uploadedImages.length > 0) {
    updateData.productImages = uploadedImages;
  }

  // update only provided fields
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  );
  // 7. Delete old images AFTER DB update
  if (uploadedImages.length > 0 && oldImagesPublicId.length > 0) {
    await deleteImagesFromCloudinary(oldImagesPublicId);
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

// 4️⃣ Delete Product
const deleteProduct = AsyncHandler(async (req, res) => {
  const productId = req.params.productId;
  console.log(productId);

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
  const { page = 1, limit = 20 } = req.query;

  // Build aggregation pipeline
  const aggregate = Product.aggregate().sort({ createdAt: -1 });

  // Execute aggregatePaginate
  const products = await Product.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  if (!products.docs.length) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          400,
          {},
          "Products not found, please add products first"
        )
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "All products fetched successfully"));
});

export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getAdminProducts,
};
