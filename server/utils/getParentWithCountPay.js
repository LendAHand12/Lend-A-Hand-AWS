import User from "../models/userModel.js";

const getParentWithCountPay = async (userId, countPay) => {
  let user = await User.findById(userId);
  let countPayReal = countPay % 12;
  let currentLevel = 0;

  while (user && currentLevel < countPayReal + 1) {
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
