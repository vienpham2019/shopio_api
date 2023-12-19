const UserRoleEnum = Object.freeze({
  ADMIN: "0921",
  USER: "3172",
  SHOP: "1382",
  EDITOR: "8263",
  // Add more roles as needed
});

const UserStatusEnum = Object.freeze({
  ACTIVE: "Active",
  INACTIVE: "InActive",
});

module.exports = { UserRoleEnum, UserStatusEnum };
