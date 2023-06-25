import User from "../models/userModel.js";

const getParentWithCountPay = async (userId, countPay) => {
  let user = await User.findById(userId);
  let currentLevel = 0;

  while (user && currentLevel < countPay) {
    if (user.parentId) {
      user = await User.findById(user.parentId);
    } else {
      break;
    }
    currentLevel++;
  }

  return user;
};

export default getParentWithCountPay;
