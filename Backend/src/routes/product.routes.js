import express from "express";
const router = express.Router();
import { Upload } from "../middleware/multer.middleware.js";

import {
  authorizeRoles,
  verifyUserAuth,
} from "../middleware/auth.middleware.js";

// Routes
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAdminProducts,
} from "../controller/product.controller.js";

router.route("/get-all").get(getAllProducts);

router.route("/:id").get(getProductById);

// admin routes
router
  .route("/admin/create")
  .post(
    verifyUserAuth,
    authorizeRoles("admin"),
    Upload.array("productImages", 5),
    createProduct
  );

router
  .route("/admin/getAll")
  .get(verifyUserAuth, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/product/:productId")
  .put(
    verifyUserAuth,
    authorizeRoles("admin"),
    Upload.array("productImages", 5),
    updateProduct
  )
  .delete(verifyUserAuth, authorizeRoles("admin"), deleteProduct);

export default router;
