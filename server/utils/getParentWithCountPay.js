import Tree from "../models/treeModel.js";
import User from "../models/userModel.js";

const getParentWithCountPay = async (userId, countPay, tier) => {
  let tree = await Tree.findOne({ userId, tier });
  let countPayReal = countPay;
  let currentLevel = 0;

  while (tree && currentLevel < countPayReal + 1) {
    if (tree.parentId) {
      tree = await Tree.findOne({ userId: tree.parentId, tier });
    } else {
      break;
    }
    currentLevel++;
  }
  const parent = await User.findById(tree.userId);
  return parent;
};

export default getParentWithCountPay;
