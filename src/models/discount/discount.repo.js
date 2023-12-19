"use strict";

const { ForbiddenError } = require("../../core/error.response");
const {
  getUnSelectData,
  getSelectData,
  getSortBy,
  getSkip,
} = require("../../utils");
const { DiscountAppliesToEnum } = require("./discount.enum");
const discountModel = require("./discount.model");

// Get

const findDiscount = async (query) => {
  return await discountModel.findOne(query).lean();
};

const findAllDiscountCodesUnSelect = async ({
  limit,
  page,
  sort,
  filter,
  unSelect,
}) => {
  return await discountModel
    .find(filter)
    .sort(getSortBy(sort))
    .skip(getSkip({ page, limit }))
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();
};

const findAllDiscountCodesSelect = async ({
  limit,
  page,
  sort,
  filter,
  select,
}) => {
  return await discountModel
    .find(filter)
    .sort(getSortBy(sort))
    .skip(getSkip({ page, limit }))
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
    discount_applies_to === DiscountAppliesToEnum.ALL
      ? []
      : discount_product_ids;

  return await discountModel.create(payload);
};

// Update

const updateDiscount = async ({
  discountId,
  shopId,
  payload,
  isNew = true,
}) => {
  const filter = { _id: discountId, discount_shopId: shopId };
  const options = { new: isNew, runValidators: true };

  const updateDiscountResult = await discountModel
    .updateOne(filter, payload, options)
    .lean();
  if (updateDiscountResult.modifiedCount === 0) {
    throw new ForbiddenError(`Discount can't update`);
  }

  return updateDiscountResult;
};

const cancleDiscountUsersUsed = async ({ discountId, userId }) => {
  return await discountModel.findByIdAndUpdate(discountId, {
    $pull: {
      discount_users_used: userId,
    },
    $inc: {
      discount_used_count: -1,
    },
  });
};

const addDiscountUsersUsed = async ({ discountId, userId }) => {
  return await discountModel.findByIdAndUpdate(discountId, {
    $push: {
      discount_users_used: userId,
    },
    $inc: {
      discount_used_count: 1,
    },
  });
};

// Delete
const deleteDiscountCode = async ({ shopId, code }) => {
  const filter = { discount_code: code, discount_shopId: shopId };
  const deleteDiscount = await discountModel.deleteOne(filter);
  if (deleteDiscount.deletedCount === 0) {
    throw new ForbiddenError(`Discount not found or can't deleted`);
  }
  return deleteDiscount;
};

module.exports = {
  findDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  createDiscount,
  cancleDiscountUsersUsed,
  addDiscountUsersUsed,
  updateDiscount,
  deleteDiscountCode,
};
