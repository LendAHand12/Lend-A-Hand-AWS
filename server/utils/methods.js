import Tree from "../models/treeModel.js";
import User from "../models/userModel.js";

export const getParentUser = async (userId, tier) => {
  const tree = await Tree.findOne({ userId, tier });

  if (!tree) {
    throw new Error("System not found");
  }

  const parentUser = await User.findById(tree.parentId);

  if (!parentUser) {
    throw new Error("Couldn't find any superior information");
  }

  return parentUser;
};

export const getRefParentUser = async (userId, tier) => {
  const tree = await Tree.findOne({ userId, tier });

  if (!tree) {
    throw new Error("System not found");
  }

  const parentUser = await User.findById(tree.refId);

  if (!parentUser) {
    throw new Error("No referrer information found");
  }

  return parentUser;
};

// Hàm tìm người sẽ được lắp tiếp theo
export const findNextUser = async (tier) => {
  const allTrees = await Tree.find({ tier }).sort({ createdAt: -1 });

  // Tạo một mảng để theo dõi số lượng con của mỗi người dùng
  const userChildrenCount = new Map();
  allTrees.forEach((tree) => {
    const userId = tree.userId;
    if (!userChildrenCount.has(userId)) {
      userChildrenCount.set(userId, tree.children.length);
    }
  });

  // Tìm người dùng có ít con nhất trong hệ thống
  let minChildren = Infinity;
  let nextUser = null;
  userChildrenCount.forEach((count, userId) => {
    if (count < 3) {
      nextUser = allTrees.find((tree) => tree.userId === userId).userId;
    } else if (count < minChildren) {
      minChildren = count;
      nextUser = allTrees.find((tree) => tree.userId === userId).userId;
    }
  });
  return nextUser;
};
