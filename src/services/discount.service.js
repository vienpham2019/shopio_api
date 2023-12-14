"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
  findDiscount,
  createDiscount,
  findAllDiscountCodesUnSelect,
  updateDiscountUsersUsed,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");

const { convertToObjectIdMongoDB } = require("../utils");

/*
    Discount Services 
    - Generator Discount Code [Shop | Admin]
    - Get discount amount [User]
    - Get all discount codes [User | Shop]
    - Verify discount code [User]
    - Delete discount code [Admin | Shop]
    - Cancel discoount code [User]
*/

class Discount {
  construct({
    applies_to,
    code,
    description,
    end_date,
    is_active,
    max_uses,
    max_uses_per_user,
    min_order_value,
    name,
    product_ids,
    shopId,
    start_date,
    type,
    users_used,
    used_count,
    value,
  }) {
    this.discount_applies_to = applies_to;
    this.discount_code = code;
    this.discount_description = description;
    this.discount_end_date = new Date(end_date);
    this.discount_start_date = new Date(start_date);
    this.discount_is_active = is_active;
    this.discount_max_uses = max_uses;
    this.discount_max_uses_per_user = max_uses_per_user;
    this.discount_min_order_value = min_order_value;
    this.discount_name = name;
    this.discount_product_ids = product_ids;
    this.discount_shopId = shopId;
    this.discount_type = type;
    this.discount_users_used = users_used;
    this.discount_used_count = used_count;
    this.discount_value = value;
  }
}

class DiscountService {
  // Create
  static async createDiscountCode(payload) {
    const newDiscount = new Discount(payload);
    const {
      discount_start_date,
      discount_end_date,
      discount_code,
      discount_shopId,
    } = newDiscount;

    const currentDate = new Date();
    const startDate = discount_start_date;
    const endDate = discount_end_date;

    if (currentDate < startDate || startDate >= endDate) {
      throw new BadRequestError("Invalid discount dates!");
    }

    payload.discount_start_date = startDate;
    payload.discount_end_date = endDate;

    const foundDiscount = await findDiscount({
      discount_code,
      discount_shopId: convertToObjectIdMongoDB(discount_shopId),
    });

    if (foundDiscount) {
      throw new BadRequestError("Discount exists!");
    }

    return await createDiscount(newDiscount);
  }

  // Update
  static async updateDiscountCode() {}

  //   Get all discount codes avaliable with product
  static async getAllDiscountCodesWithProduct({ code, shopId, limit, page }) {
    const foundDiscount = await findDiscount({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });

    if (!foundDiscount?.discount_is_active) {
      throw new BadRequestError("Discount not exists");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongoDB(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  // Get all discount codes of shop
  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    return await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discoount_shopId: convertToObjectIdMongoDB(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
    });
  }

  // Get Discount amout by Coupon Code for shop
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await findDiscount({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });

    if (!foundDiscount) throw new NotFoundError("Coupon code not exists!");

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_max_users_per_user,
      discount_users_used,
    } = foundDiscount;

    if (!discount_is_active)
      throw new NotFoundError("Coupon code has expired!");
    if (discount_max_uses < 1) throw new NotFoundError("Coupon code are out!");
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("Coupon code has expired!");
    }

    // check for minimum order total for apply coupon
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `The minimum spend for this coupon is ${discount_min_order_value}`
        );
      }
    }

    // check for user already use discount and base on discount_max_per_user
    const numUserUseDiscount = discount_users_used.filter(
      (user) => user.userId === userId
    ).length;
    if (numUserUseDiscount >= discount_max_users_per_user) {
      throw new NotFoundError(
        "Discount code has exceeded the number of times it can be used"
      );
    }

    // check discount fixed amount
    const discountAmount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discountAmount,
      totalPrice: totalOrder - discountAmount,
    };
  }

  // Delete discount
  static async deleteDiscountCode({ shopId, code }) {
    const foundDiscount = await findDiscount({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });
    // write some code here
  }

  // Cancel coupon code in checkout when user not need
  static async cancleDiscountCode({ shopId, code, userId }) {
    const foundDiscount = await findDiscount({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDB(shopId),
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't existst");
    return await updateDiscountUsersUsed({
      discountId: foundDiscount._id,
      userId,
    });
  }
}

module.exports = DiscountService;
