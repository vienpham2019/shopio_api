"use strict";

const { getUnSelectData, getSelectData } = require("../../utils");
const discountModel = require("../discount/discount.model");

// Find
const findDiscount = async (query) => {
  return await discountModel.findOne(query).lean();
};

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();
};
const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
};

// Create

const createDiscount = async (payload) => {
  const {
    discount_min_order_value,
    discount_product_ids,
    discount_applies_to,
  } = payload;
  payload.discount_min_order_value = discount_min_order_value || 0;
  payload.discount_product_ids =
    discount_applies_to === "all" ? [] : discount_product_ids;

  return await discountModel.create(payload);
};

// Update
const updateDiscountUsersUsed = async ({ discountId, userId }) => {
  return await discountModel.findByIdAndUpdate(discountId, {
    $pull: {
      discount_users_used: userId,
    },
    $inc: {
      discount_max_uses: 1,
      discount_uses_count: -1,
    },
  });
};

// Delete

module.exports = {
  findDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  createDiscount,
  updateDiscountUsersUsed,
};
