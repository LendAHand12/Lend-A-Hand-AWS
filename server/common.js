import Tree from "./models/treeModel.js";
import User from "./models/userModel.js";
import getParentWithCountPay from "./utils/getParentWithCountPay.js";

export const transferUserToTree = async () => {
  const listUser = await User.find({ isAdmin: false });

  for (let user of listUser) {
    await Tree.create({
      userName: user.userId,
      userId: user._id,
      parentId: user.parentId,
      refId: user.refId,
      children: user.children,
      tier: user.tier,
    });
  }

  console.log("transfer done");
};

export const getParentWithCount = async (id) => {
  const user = await User.findById(id);

  const parentWithCount = await getParentWithCountPay(
    id,
    user.countPay,
    user.tier
  );

  console.log({ parentWithCount });
};

export const transferLayerToArray = async () => {
  const listUser = await User.find({ isAdmin: false });

  for (let user of listUser) {
    user.currentLayer = [0];
    user.oldLayer = [0];
    await user.save();
  }

  console.log("transfer layer to array done");
};
