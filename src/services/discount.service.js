"use strict";

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../core/error.response");
const {
  DiscountAppliesToEnum,
  DiscountTypeEnum,
} = require("../models/discount/discount.enum");
const {
  findDiscount,
  createDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  cancleDiscountUsersUsed,
  addDiscountUsersUsed,
  updateDiscount,
  deleteDiscountCode,
} = require("../models/discount/discount.repo");
const {
  findAllProducts,
  findProductByShopId,
  checkForValidProductIds,
} = require("../models/product/product.repo");

const {
  convertToObjectIdMongoDB,
  removeUndefinedNull,
  isInValidDate,
  removeDuplicatesInArray,
} = require("../utils");

/*
    Discount Services 
    - Generator Discount Code [Shop | Admin]
    - Get discount amount [User]
    - Get all discount codes [User | Shop]
    - Verify discount code [User]
    - Delete discount code [Admin | Shop]
    - Cancel discoount code [User]
*/

class DiscountService {
  // Get
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    limit = 50,
    page = 1,
    sort = "ctime",
  }) {
    const foundDiscount = await findDiscount({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });

    if (!foundDiscount?.discount_is_active) {
      throw new BadRequestError("Discount not exists");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === DiscountAppliesToEnum.ALL) {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoDB(shopId),
          isPublished: true,
        },
        limit,
        page,
        sort,
        select: ["product_name"],
      });
    } else if (discount_applies_to === DiscountAppliesToEnum.SPECIFIC) {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit,
        page,
        sort,
        select: ["product_name"],
      });
    }
    return products;
  }

  static async getAllDiscountCodeByUser({
    limit = 50,
    page = 1,
    sort = "ctime",
    shopId,
  }) {
    const filter = {
      discount_shopId: convertToObjectIdMongoDB(shopId),
      discount_is_active: true,
    };
    const select = [
      "discount_name",
      "discount_description",
      "discount_code",
      "discount_start_date",
      "discount_end_date",
      "discount_type",
      "discount_value",
      "-_id",
    ];
    return await findAllDiscountCodesSelect({
      limit,
      page,
      sort,
      filter,
      select,
    });
  }

  static async getAllDiscountCodeByShop({
    limit = 50,
    page = 1,
    sort = "ctime",
    shopId,
  }) {
    const filter = {
      discount_shopId: convertToObjectIdMongoDB(shopId),
    };
    const unSelect = ["__v", "discount_shopId"];
    return await findAllDiscountCodesUnSelect({
      limit,
      page,
      sort,
      filter,
      unSelect,
    });
  }

  // Create
  static async createDiscountCode(payload) {
    const { discount_start_date, discount_end_date, discount_code } = payload;

    payload.discount_start_date = new Date(discount_start_date);
    payload.discount_end_date = new Date(discount_end_date);

    // Check for valid date
    if (isInValidDate(payload.discount_start_date, payload.discount_end_date)) {
      throw new BadRequestError("Invalid discount dates!");
    }

    const foundDiscount = await findDiscount({
      discount_code,
    });

    if (foundDiscount) {
      throw new BadRequestError("Discount exists!");
    }

    if (payload.discount_applies_to == DiscountAppliesToEnum.SPECIFIC) {
      payload.discount_product_ids = removeDuplicatesInArray(
        payload.discount_product_ids
      );
      const invalidProductIds = await checkForValidProductIds({
        payload: payload.discount_product_ids,
        shopId: payload.discount_shopId,
      });
      if (invalidProductIds.length < payload.discount_product_ids.length) {
        throw new BadRequestError(
          "Some of the products are not published or do not exist!"
        );
      }
    }

    return await createDiscount(payload);
  }

  // Update
  static async updateDiscountCode({ payload, discountId, shopId }) {
    const foundDiscount = await findDiscount({
      _id: discountId,
      discount_shopId: shopId,
    });

    if (!foundDiscount) {
      throw new BadRequestError(`Discount not found`);
    }

    // check if discount expire
    if (new Date(foundDiscount.discount_end_date) < new Date()) {
      throw new BadRequestError("Discount has expired. Cannot update.");
    }
    payload.discount_product_ids = removeDuplicatesInArray(
      payload.discount_product_ids
    );
    if (payload.discount_product_ids) {
      const invalidProductIds = await checkForValidProductIds({
        payload: payload.discount_product_ids,
        shopId: payload.discount_shopId,
      });
      if (invalidProductIds.length < payload.discount_product_ids.length) {
        throw new BadRequestError(
          "Some of the products are not published or do not exist!"
        );
      }
    }
    payload = removeUndefinedNull(payload);

    // Check for discount start then can't update discount code
    if (payload.discount_code) {
      if (new Date(foundDiscount.discount_start_date) <= new Date()) {
        throw new BadRequestError(
          "Discount already start. Cannot update discount code"
        );
      }
      const existDiscount = await findDiscount({
        discount_code: payload.discount_code,
        discount_shopId: shopId,
      });
      if (existDiscount) {
        throw new BadRequestError("Discount exists!");
      }
    }

    // check for valid date
    let { discount_start_date, discount_end_date } = payload;
    if (discount_start_date || discount_end_date) {
      if (!discount_start_date) {
        discount_start_date = foundDiscount.discount_start_date;
      }
      if (!discount_end_date) {
        discount_end_date = foundDiscount.discount_end_date;
      }
      if (isInValidDate(discount_start_date, discount_end_date)) {
        throw new BadRequestError("Invalid discount dates!");
      }
    }
    return await updateDiscount({
      discountId,
      shopId,
      payload,
    });
  }

  static async getDiscountAmount({ code, userId, products }) {
    const foundDiscount = await findDiscount({
      discount_code: code,
    });

    if (!foundDiscount) throw new NotFoundError("Coupon code not exists!");

    const {
      discount_is_active,
      discount_max_uses,
      discount_used_count,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_users_used,
      discount_min_order_value,
      discount_product_ids,
      discount_applies_to,
      discount_type,
      discount_value,
      discount_shopId,
    } = foundDiscount;

    // Check for avaliable coupon code
    if (discount_used_count >= discount_max_uses) {
      throw new BadRequestError(
        `Discount code has exceeded the max number of times can use`
      );
    }
    // check for user already use discount and base on discount_max_per_user
    const numUserUseDiscount = discount_users_used.filter(
      (userUsedId) => userUsedId === userId
    ).length;
    if (numUserUseDiscount >= discount_max_uses_per_user) {
      throw new BadRequestError(
        `You has exceeded the max number of times can use this coupon code`
      );
    }

    // check for date
    if (new Date() < new Date(discount_start_date)) {
      throw new BadRequestError(
        `Coupon code start from ${discount_start_date} and end at ${discount_end_date}`
      );
    }
    if (!discount_is_active)
      throw new BadRequestError("Coupon code has expired!");
    if (discount_max_uses < 1)
      throw new BadRequestError("Coupon code are out!");
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Coupon code has expired!");
    }

    let discountProductIds = [];
    // check for minimum order total for apply coupon
    let subTotal = 0;
    for (let product of products) {
      const foundProduct = await findProductByShopId({
        shopId: discount_shopId,
        productId: product._id,
      });
      if (foundProduct) {
        if (discount_applies_to === DiscountAppliesToEnum.ALL) {
          discountProductIds.push(foundProduct._id);
          subTotal += product.product_quantity * foundProduct.product_price;
        } else {
          if (discount_product_ids.includes(product._id)) {
            discountProductIds.push(foundProduct._id);
            subTotal += product.product_quantity * foundProduct.product_price;
          }
        }
      }
    }

    if (subTotal < discount_min_order_value) {
      throw new BadRequestError(
        `The minimum spend for this coupon is ${discount_min_order_value}`
      );
    }

    // check discount fixed amount
    const discountAmount =
      discount_type === DiscountTypeEnum.FIXED
        ? discount_value
        : subTotal * (discount_value / 100);

    const addUserUsed = await addDiscountUsersUsed({
      discountId: foundDiscount._id,
      userId,
    });

    if (!addUserUsed) {
      throw new ForbiddenError(
        `Can't get amout by discount code. Please try again!`
      );
    }

    return {
      subTotal,
      discountAmount,
      discountProductIds,
      grandTotal: subTotal - discountAmount,
    };
  }

  static async cancleDiscountCode({ code, userId }) {
    const foundDiscount = await findDiscount({
      discount_code: code,
    });

    if (!foundDiscount) throw new BadRequestError("Discount doesn't existst");
    if (!foundDiscount.discount_users_used.includes(userId)) {
      throw new BadRequestError();
    }
    const cancleUserUsed = await cancleDiscountUsersUsed({
      discountId: foundDiscount._id,
      userId,
    });
    if (!cancleUserUsed) {
      throw new ForbiddenError(`Can't cancle coupon code. Please try again!`);
    }
    return {
      acknowledged: true,
      discountCancleCount: 1,
    };
  }

  // Delete
  static async deleteDiscountCode({ shopId, code }) {
    return await deleteDiscountCode({ shopId, code });
    // write some code here
  }
}

module.exports = DiscountService;
