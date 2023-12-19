const DiscountTypeEnum = Object.freeze({
  FIXED: "fixed_amount",
  PERCENTAGE: "percentage_amount",
  // Add more roles as needed
});

const DiscountAppliesToEnum = Object.freeze({
  ALL: "all",
  SPECIFIC: "specific",
});

module.exports = { DiscountTypeEnum, DiscountAppliesToEnum };
