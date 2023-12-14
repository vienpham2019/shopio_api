"use strict";
const inventoryModel = require("../inventory/inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_shopId: shopId,
    inven_location: location,
  });
};

module.exports = {
  insertInventory,
};
