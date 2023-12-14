"use strict";

const { Types } = require("mongoose");

const { getSelectData, getUnSelectData } = require("../../utils");
const { BadRequestError } = require("../../core/error.response");
const productModel = require("../product/product.model");

const createProductAttributes = async ({ model, payload }) => {
  const newAttributes = await model.create(payload);
  if (!newAttributes) {
    throw new BadRequestError("Create new product attributes error");
  }

  const { product_shop, createdAt, updatedAt, __v, _id, ...attributes } =
    newAttributes._doc;
  return { attributes, productId: newAttributes._id };
};

const searchProductByUser = async ({
  keySearch,
  unSelect = ["product_name", "product_price", "product_thumbnail"],
  isNew = true,
}) => {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } },
      { new: isNew }
    )
    .sort({ score: { $meta: "textScore" } })
    .select(getUnSelectData(unSelect))
    .lean();
  return results;
};

const findAllDraftsForShop = async ({ shopId, limit, skip }) => {
  const query = { product_shop: shopId, isDraft: true };
  return await queryProduct({ query, limit, skip });
};

const findAllPublishsForShop = async ({ shopId, limit, skip }) => {
  const query = { product_shop: shopId, isPublished: true };
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .select("-updatedAt -createdAt -__v") // not select fields
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publishProductByShop = async ({
  shopId,
  productId,
  unSelect = ["createdAt", "updatedAt", "__v", "_id"],
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
  unSelect = ["createdAt", "updatedAt", "__v", "_id"],
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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  filter.isPublished = true;
  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ productId, unSelect }) => {
  return await productModel
    .findById(productId)
    .select(getUnSelectData(unSelect))
    .lean();
};

const updateProductById = async ({
  productId,
  shopId,
  payload,
  model,
  unSelect = ["product_shop", "createdAt", "updatedAt", "__v", "_id"],
  isNew = true,
}) => {
  const filter = {
    _id: new Types.ObjectId(productId),
    product_shop: new Types.ObjectId(shopId),
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
};
