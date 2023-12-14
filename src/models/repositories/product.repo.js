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

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishsForShop = async ({ query, limit, skip }) => {
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

const publishProductByShop = async ({ product_shop, product_id }) => {
  return await updatePublishProduct({
    product_shop,
    product_id,
    publish_val: true,
  });
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  return await updatePublishProduct({
    product_shop,
    product_id,
    publish_val: false,
  });
};

const updatePublishProduct = async ({
  product_shop,
  product_id,
  publish_val,
}) => {
  const foundProduct = await productModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) return null;

  const { modifiedCount } = await productModel.updateOne(
    { _id: new Types.ObjectId(product_id) },
    { isDraft: !publish_val, isPublished: publish_val }
  );
  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await productModel
    .findById(product_id)
    .select(getUnSelectData(unSelect))
    .lean();
};

const updateProductById = async ({
  productId,
  payload,
  model,
  unSelect = ["product_shop", "createdAt", "updatedAt", "__v", "_id"],
  isNew = true,
}) => {
  const updateProd = await model
    .findByIdAndUpdate(productId, payload, { new: isNew })
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
