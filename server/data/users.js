import bcrypt from "bcryptjs";

const users = [
  {
    userId: "Admin1",
    walletAddress: "0x026282fD2D744bBe67B05d7b38998CEE6B501CA6",
    email: "admin1@gmail.com",
    password: bcrypt.hashSync("Pierre@@1968", 12),
    tier: 5,
    childrend: [],
    parentId: "",
    isAdmin: true,
    isConfirmed: true,
    status: "APPROVED",
    fine: 0,
    avatar: "/images/icon_user.png",
    imgFront: "",
    imgBack: "",
    countPay: 100,
  },
  {
    userId: "Admin2",
    walletAddress: "0x026282fD2D744bBe67B05d7b38998CEE6B501CA6",
    email: "admin2@gmail.com",
    password: bcrypt.hashSync("Pierre@@1968", 12),
    tier: 5,
    childrend: [],
    parentId: "",
    isAdmin: true,
    isConfirmed: true,
    status: "APPROVED",
    fine: 0,
    avatar: "/images/icon_user.png",
    imgFront: "",
    imgBack: "",
    countPay: 100,
  },
  {
    userId: "Admin3",
    walletAddress: "0x026282fD2D744bBe67B05d7b38998CEE6B501CA6",
    email: "admin3@gmail.com",
    password: bcrypt.hashSync("Pierre@@1968", 12),
    tier: 5,
    childrend: [],
    parentId: "",
    isAdmin: true,
    isConfirmed: true,
    status: "APPROVED",
    fine: 0,
    avatar: "/images/icon_user.png",
    imgFront: "",
    imgBack: "",
    countPay: 100,
  },
  {
    userId: "Admin4",
    walletAddress: "0x026282fD2D744bBe67B05d7b38998CEE6B501CA6",
    email: "admin4@gmail.com",
    password: bcrypt.hashSync("Pierre@@1968", 12),
    tier: 5,
    childrend: [],
    parentId: "",
    isAdmin: true,
    isConfirmed: true,
    status: "APPROVED",
    fine: 0,
    avatar: "/images/icon_user.png",
    imgFront: "",
    imgBack: "",
    countPay: 100,
  },
];

export default users;
