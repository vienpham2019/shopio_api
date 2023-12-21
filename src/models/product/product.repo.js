"use strict";

const { Types } = require("mongoose");

const {
  getSelectData,
  getUnSelectData,
  getSkip,
  getSortBy,
} = require("../../utils");
const { BadRequestError } = require("../../core/error.response");
const productModel = require("./product.model");

// Get
const checkForValidProductIds = async ({ payload, shopId }) => {
  return await productModel.find({
    _id: { $in: payload },
    product_shopId: shopId,
    isPublished: true,
  });
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  filter.isPublished = true;
  const products = await productModel
    .find(filter)
    .sort(getSortBy(sort))
    .limit(limit)
    .skip(getSkip({ page, limit }))
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProductByShopId = async ({ shopId, productId }) => {
  return await productModel
    .findOne({ _id: productId, product_shopId: shopId, isPublished: true })
    .lean();
};

const findProduct = async ({ productId, unSelect }) => {
  return await productModel
    .findById(productId)
    .select(getUnSelectData(unSelect))
    .lean();
};

const getProductType = async ({ productId }) => {
  const { product_type } = await productModel.findById(productId).lean();
  return product_type;
};

const findAllDraftsForShop = async ({ shopId, limit, page }) => {
  const query = { product_shopId: shopId, isDraft: true };
  return await queryProduct({ query, limit, page });
};

const findAllPublishsForShop = async ({ shopId, limit, page }) => {
  const query = { product_shopId: shopId, isPublished: true };
  return await queryProduct({ query, limit, page });
};

const queryProduct = async ({ query, page, limit }) => {
  return await productModel
    .find(query)
    .populate("product_shopId", "name email -_id")
    .select("-updatedAt -createdAt -__v") // not select fields
    .sort({ updateAt: -1 })
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .lean()
    .exec();
};

const searchProductByUser = async ({
  keySearch,
  select,
  isNew,
  limit,
  page,
}) => {
  const regexSearch = new RegExp(keySearch);
  const filter = {
    isPublished: true,
    $text: { $search: regexSearch },
  };
  const search = { score: { $meta: "textScore" } };
  const options = { new: isNew };

  return await productModel
    .find(filter, search, options)
    .select(getSelectData(select))
    .sort(search)
    .limit(limit)
    .skip(getSkip({ page, limit }))
    .lean()
    .exec();
};

// Create
const createProductAttributes = async ({ model, payload }) => {
  const newAttributes = await model.create(payload);
  if (!newAttributes) {
    throw new BadRequestError("Create new product attributes error");
  }

  const { product_shopId, createdAt, updatedAt, __v, _id, ...attributes } =
    newAttributes._doc;
  return { attributes, productId: newAttributes._id };
};

// Update
const publishProductByShop = async ({
  shopId,
  productId,
  unSelect,
  isNew = false,
}) => {
  return await updateProductById({
    shopId,
    productId,
    payload: { isDraft: false, isPublished: true },
    model: productModel,
    unSelect,
    isNew,
  });
};

const unPublishProductByShop = async ({
  shopId,
  productId,
  unSelect,
  isNew = false,
}) => {
  return await updateProductById({
    shopId,
    productId,
    payload: { isDraft: true, isPublished: false },
    model: productModel,
    unSelect,
    isNew,
  });
};

const updateProductById = async ({
  productId,
  shopId,
  payload,
  model,
  unSelect,
  isNew = true,
}) => {
  const filter = {
    _id: new Types.ObjectId(productId),
    product_shopId: new Types.ObjectId(shopId),
  };
  const update = {
    $set: payload,
  };
  const options = {
    new: isNew, // Return the updated document
  };

  const updateProd = await model
    .findOneAndUpdate(filter, update, options)
    .select(getUnSelectData(unSelect))
    .lean();

  if (!updateProd) throw new BadRequestError("Invalid product id");
  return updateProd;
};

// Delete
const deleteDraftProduct = async ({ productId, shopId, attributesModel }) => {
  const deleteProduct = await productModel.deleteOne({
    product_shopId: shopId,
    _id: productId,
    isDraft: true,
  });
  if (deleteProduct.deletedCount === 0) {
    throw new BadRequestError("Product not found or not deleted");
  }

  return await attributesModel.deleteOne({
    product_shopId: shopId,
    _id: productId,
  });
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishsForShop,
  queryProduct,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  createProductAttributes,
  deleteDraftProduct,
  getProductType,
  findProductByShopId,
  checkForValidProductIds,
};
