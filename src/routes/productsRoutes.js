// libraries
import { Router } from 'express';
import { celebrate } from 'celebrate';
// middleware
import { authenticate } from '../middleware/authenticate.js';
// controllers
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from '../controllers/productsController.js';
// validation schemas
import {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
  getAllProductsSchema,
} from '../validation/productsValidation.js';

const router = Router();

// add authentication for all product routes
router.use('/products', authenticate);

// all routes below are protected by authentication
router.get('/products', celebrate(getAllProductsSchema), getAllProducts);

router.get('/products/:productId', celebrate(productIdSchema), getProductById);

router.post('/products', celebrate(createProductSchema), createProduct);

router.delete(
  '/products/:productId',
  celebrate(productIdSchema),
  deleteProduct,
);

router.patch(
  '/products/:productId',
  celebrate(updateProductSchema),
  updateProduct,
);

export default router;
