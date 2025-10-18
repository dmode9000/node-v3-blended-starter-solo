// libraries
import createHttpError from 'http-errors';
// models
import { Product } from '../models/product.js';

// controllers
export const getAllProducts = async (req, res) => {
  // get query params
  const { page = 1, perPage = 10, category, search } = req.query;
  const skip = (page - 1) * perPage;

  // create base query, to which will add filters
  const productsQuery = Product.find();

  // filter products by the authenticated user
  productsQuery.where('userId').equals(req.user._id);

  // text index search if search exists
  if (search) {
    productsQuery.where({
      $text: { $search: search },
    });
  }

  // tag filter if tag exists
  if (category) {
    productsQuery.where('category').equals(category);
  }

  // make both queries in parallel
  const [totalProducts, products] = await Promise.all([
    productsQuery.clone().countDocuments(),
    productsQuery.skip(skip).limit(perPage),
  ]);

  // calculate total pages
  const totalPages = Math.ceil(totalProducts / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalProducts,
    totalPages,
    products,
  });
};

export const getProductById = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findOne({
    _id: productId, // find by id
    userId: req.user._id, // check ownership
  });

  if (!product) {
    next(createHttpError(404, 'Product not found'));
    return;
  }
  res.status(200).json(product);
};

export const createProduct = async (req, res) => {
  const product = await Product.create({ ...req.body, userId: req.user._id });
  res.status(201).json(product);
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findOneAndDelete({
    _id: productId, // find by id
    userId: req.user._id, // check ownership
  });

  if (!product) {
    next(createHttpError(404, 'Product not found'));
    return;
  }

  res.status(200).send(product);
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findOneAndUpdate(
    { _id: productId, userId: req.user._id }, // find by id and check ownership
    req.body,
    {
      new: true, // return the updated document
    },
  );

  if (!product) {
    next(createHttpError(404, 'Product not found'));
    return;
  }

  res.status(200).json(product);
};
