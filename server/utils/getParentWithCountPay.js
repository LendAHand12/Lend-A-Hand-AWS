import User from "../models/userModel.js";

const getParentWithCountPay = async (userId, countPay) => {
  let user = await User.findById(userId);
  let countPayReal = countPay % 12;
  console.log({ countPayReal });
  let currentLevel = 0;

  while (user && currentLevel < countPayReal + 1) {
    // console.log({ user });
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
