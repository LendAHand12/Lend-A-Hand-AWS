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
  const newAllTrees = await Tree.find({ tier }).sort({ createdAt: 1 });

  // for (let tree of newAllTrees) {
  //   console.log({
  //     name: tree.userName,
  //     id: tree.userId,
  //     length: tree.children.length,
  //   });
  // }

  const list3Child = newAllTrees.filter((tree) => tree.children.length === 3);
  if (list3Child.length === newAllTrees.length) return newAllTrees[0].userId;
  const list2Child = newAllTrees.filter((tree) => tree.children.length === 2);
  if (list2Child.length === newAllTrees.length) return newAllTrees[0].userId;
  const list1Child = newAllTrees.filter((tree) => tree.children.length === 1);
  if (list1Child.length === newAllTrees.length) return newAllTrees[0].userId;
  const list0Child = newAllTrees.filter((tree) => tree.children.length === 0);
  if (list0Child.length === newAllTrees.length) return newAllTrees[0].userId;

  const max = findMax(newAllTrees.map((item) => item.children.length));

  for (let i = 0; i < newAllTrees.length; i++) {
    if (newAllTrees[i].children.length < 3) {
      const listAe = await Tree.find({
        $and: [
          { parentId: newAllTrees[i].parentId },
          { tier },
          { userName: { $ne: newAllTrees[i].userName } },
        ],
      }).sort({ createdAt: 1 });
      if (listAe.length > 0) {
        for (let ae of listAe) {
          if (ae.children.length < newAllTrees[i].children.length) {
            return ae.userId;
          }
        }
      }
      if (newAllTrees[i].children.length < max) {
        if (newAllTrees[i].children.length > newAllTrees[i + 1].children.length)
          return newAllTrees[i + 1].userId;
      }
    }
  }
};

function findMax(arr) {
  if (arr.length === 0) {
    return -1; // Trả về -1 nếu mảng rỗng
  }

  let maxValue = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
    }
  }

  return maxValue;
}

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
    if (child && child.countPay !== 0) {
      count += await countDescendants(childId, layer - 1, tier);
    }
  }

  return count;
};
