"use strict";
const inventoryModel = require("./inventory.model");

// Create
const createInventory = async ({
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

// Delete
const deleteInventory = async ({ productId, shopId }) => {
  const filter = { inven_productId: productId, inven_shopId: shopId };
  return inventoryModel.deleteOne(filter);
};

module.exports = {
  createInventory,
  deleteInventory,
};
