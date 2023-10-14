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
  const allTrees = await Tree.find({ tier }).sort({ createdAt: 1 });
  const newAllTrees = allTrees.filter((tree) => tree.children.length < 3);

  // for (let tree of newAllTrees) {
  //   console.log({
  //     name: tree.userName,
  //     date: tree.createdAt,
  //     length: tree.children.length,
  //   });
  // }

  const lastMaxIndex = findLastIndexOfMax(
    newAllTrees.map((item) => item.children.length)
  );
  if (lastMaxIndex > -1) {
    return newAllTrees[lastMaxIndex + 1].userId;
  }
};

const findLastIndexOfMax = (arr) => {
  if (arr.length === 0) {
    return -1;
  }

  let max = arr[0];
  let lastIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] >= max) {
      max = arr[i];
      lastIndex = i;
    }
  }

  return lastIndex;
};

export const findRootLayer = async (id, tier) => {
  // Tìm người dùng root đầu tiên (có parentId null)
  const root = await User.findById(id);
  if (!root) {
    return 0; // Nếu không tìm thấy root, trả về 0
  }

  let layer = 1;
  let currentLayerCount = 1; // Số lượng node hoàn chỉnh ở tầng hiện tại (ban đầu là 1)

  while (true) {
    const nextLayerCount = currentLayerCount * 3; // Số lượng node hoàn chỉnh trong tầng tiếp theo
    const totalDescendants = await countDescendants(root._id, layer, tier); // Tính tổng số con (bao gồm cả node hoàn chỉnh và node chưa đủ 3 cấp dưới)

    if (totalDescendants < nextLayerCount) {
      break;
    }

    layer++;
    currentLayerCount = nextLayerCount;
  }

  return layer - 1; // Trừ 1 vì layer hiện tại là layer chưa hoàn chỉnh
};

export const countDescendants = async (userId, layer, tier) => {
  const tree = await Tree.findOne({ userId, tier });

  if (!tree) {
    return 0;
  }

  if (layer === 0) {
    return 1; // Nếu đã đủ 3 cấp dưới thì tính là một node hoàn chỉnh
  }

  let count = 0;

  for (const childId of tree.children) {
    const child = await User.findById(childId);
    if (child.countPay !== 0) {
      count += await countDescendants(childId, layer - 1, tier);
    }
  }

  return count;
};
