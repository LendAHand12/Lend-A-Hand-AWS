import moment from "moment";
import NextUserTier from "../models/nextUserTierModel.js";
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

export const findNextUser = async (tier) => {
  const nextUserInDB = await NextUserTier.findOne({ tier });
  if (nextUserInDB) return nextUserInDB.userId;
  const admin = await User.findById("6494e9101e2f152a593b66f2");
  if (!admin) throw "Unknow admin";
  const listUserLevel = await findUsersAtLevel(
    admin._id,
    admin.currentLayer[tier - 1],
    2,
    1
  );

  console.log({ listUserLevel });
  const sortedData = listUserLevel.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  // for (let user of sortedData) {
  //   console.log({
  //     userName: user.userName,
  //     length: user.children.length,
  //     createdAt: user.createdAt,
  //   });
  // }

  const itemWithMinLength = sortedData.reduce((minItem, currentItem) => {
    return currentItem.children.length < minItem.children.length
      ? currentItem
      : minItem;
  }, sortedData[0]);
  return itemWithMinLength
    ? itemWithMinLength.userId
    : "6494e9101e2f152a593b66f2";
};

export const findNextUserNotIncludeNextUserTier = async (tier) => {
  const admin = await User.findById("6494e9101e2f152a593b66f2");
  if (!admin) throw "Unknow admin";
  const listUserLevel = await findUsersAtLevel(
    admin._id,
    admin.currentLayer[tier - 1],
    2,
    1
  );
  const sortedData = listUserLevel.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  // for (let user of sortedData) {
  //   console.log({
  //     userName: user.userName,
  //     length: user.children.length,
  //     createdAt: user.createdAt,
  //   });
  // }

  const itemWithMinLength = sortedData.reduce((minItem, currentItem) => {
    return currentItem.children.length < minItem.children.length
      ? currentItem
      : minItem;
  }, sortedData[0]);
  return itemWithMinLength
    ? itemWithMinLength.userId
    : "6494e9101e2f152a593b66f2";
};

export const findUsersAtLevel = async (
  rootUserId,
  targetLevel,
  tier,
  currentLevel = 1
) => {
  if (currentLevel > targetLevel) {
    return [];
  }

  const root = await Tree.findOne({ userId: rootUserId, tier }).populate(
    "children"
  );
  if (!root) {
    return [];
  }

  if (currentLevel === targetLevel) {
    return Tree.find({
      userId: { $in: root.children.map((child) => child) },
      tier,
    });
  }

  let usersAtLevel = [];
  for (const child of root.children) {
    const usersInChildren = await findUsersAtLevel(
      child,
      targetLevel,
      tier,
      currentLevel + 1
    );
    usersAtLevel = usersAtLevel.concat(usersInChildren);
  }

  return usersAtLevel;
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
    if (child && child.countPay !== 0) {
      count += await countDescendants(childId, layer - 1, tier);
    }
  }

  return count;
};

export const getUserClosestToNow = (users) => {
  const currentTime = moment();

  users.sort((userA, userB) => {
    const timeA = moment(userA.userId.lockedTime);
    const timeB = moment(userB.userId.lockedTime);
    return currentTime.diff(timeA) - currentTime.diff(timeB);
  });

  return users[0];
};

export const checkRatioCountChildOfUser = async (userId) => {
  const u = await User.findById(userId);
  if (u.countChild[0] >= 300) {
    const listChildId = await Tree.find({
      parentId: u._id,
      tier: 1,
    }).select("userId");

    let highestChildSales = 0;
    let lowestChildSales = Infinity;

    for (const childId of listChildId) {
      const child = await User.findById(childId.userId);

      if (child.countChild[0] > highestChildSales) {
        highestChildSales = child.countChild[0];
      }

      if (child.countChild[0] < lowestChildSales) {
        lowestChildSales = child.countChild[0];
      }
    }

    if (highestChildSales >= 0.4 * 300 && lowestChildSales >= 0.2 * 300) {
      return true;
    } else {
      return false;
    }
  }
};

export const removeAccents = (str) => {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str.toLowerCase();
};

export const findLevelById = async (userId, tier) => {
  try {
    // Tìm node trong cây với userId được cung cấp
    const node = await Tree.findOne({ userId, tier });

    if (!node) {
      return -1;
    }

    // Đếm số lớp cha để xác định cấp độ
    let level = 0;
    let currentParentId = node.parentId;

    while (currentParentId) {
      // Tìm node cha của node hiện tại
      const parentNode = await Tree.findOne({ userId: currentParentId, tier });

      if (!parentNode) {
        break; // Trong trường hợp có lỗi hoặc mất dữ liệu
      }

      level++;
      currentParentId = parentNode.parentId;
    }

    return level;
  } catch (error) {
    console.error("Error finding level:", error);
    return -1;
  }
};
