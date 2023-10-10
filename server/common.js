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

export const getUnknowChild = async () => {
  const listTrees = await Tree.find();

  const result = [];
  for (let tree of listTrees) {
    if (tree.children.length !== 0) {
      for (let childId of tree.children) {
        const u = await User.findById(childId);
        if (!u) {
          result.push({ treeId: tree._id, childIdß });
        }
      }
    }
  }

  console.log({ result });
};

export const addBuyPackage = async () => {
  console.log("starting");
  const listUser = await User.find({ isAdmin: false });

  for (let user of listUser) {
    if (user.countPay === 0) {
      user.buyPackage = "";
    } else if (user.countPay >= 13) {
      user.buyPackage = "A";
    } else if (user.countPay < 13 && user.countPay >= 7) {
      user.buyPackage = "B";
    } else {
      user.buyPackage = "C";
    }
    await user.save();
  }

  console.log("addBuyPackage done");
};

export const changeDefaultContinue = async () => {
  console.log("starting");
  const listUser = await User.find({ isAdmin: false });

  for (let user of listUser) {
    if (user.buyPackage === "B") {
      if (user.countPay === 7) {
        user.continueWithBuyPackageB = true;
      }
      if (user.countPay === 13 && user.continueWithBuyPackageB === true) {
        user.buyPackage = "A";
      }
      if (user.countPay === 13 && user.continueWithBuyPackageB === false) {
        user.buyPackage = "C";
      }
    } else {
      user.continueWithBuyPackageB = true;
    }
    await user.save();
  }

  console.log("changeDefaultContinue done");
};

export const transferCountChildToArray = async () => {
  const listUser = await User.find({ isAdmin: false });

  for (let user of listUser) {
    user.countChild = [...user.countChild[0]];
    await user.save();
  }

  console.log("transfer layer to array done");
};

export const addBuyPackageToTree = async () => {
  const listUser = await User.find({ isAdmin: false });

  for (let user of listUser) {
    await Tree.updateMany(
      { userName: user.userId },
      { $set: { buyPackage: user.buyPackage } }
    );
  }

  console.log("addBuyPackageToTree done");
};
