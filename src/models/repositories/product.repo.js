"use strict";

const { Types } = require("mongoose");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
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

const queryProduct = async ({ query, limit, skip }) => {
  return await product
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
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) return null;

  const { modifiedCount } = await product.updateOne(
    { _id: new Types.ObjectId(product_id) },
    { isDraft: false, isPublished: true }
  );
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) return null;

  const { modifiedCount } = await product.updateOne(
    { _id: new Types.ObjectId(product_id) },
    { isDraft: true, isPublished: false }
  );
  return modifiedCount;
};

module.exports = {
  queryProduct,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
};
