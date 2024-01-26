import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Profile = lazy(() => import("@/pages/User/Profile"));
const Transactions = lazy(() => import("@/pages/User/Transactions"));
const Tree = lazy(() => import("@/pages/User/Tree"));
const Payment = lazy(() => import("@/pages/User/Payment"));
const Referral = lazy(() => import("@/pages/User/Referral"));
const ChangeWallet = lazy(() => import("@/pages/User/ChangeWallet"));
const ChangeUser = lazy(() => import("@/pages/User/ChangeUser"));
const Legal = lazy(() => import("@/pages/User/Legal"));
const News = lazy(() => import("@/pages/User/News"));
const NewsDetails = lazy(() => import("@/pages/User/News/Details"));

const routes = [
  {
    path: "/profile",
    title: "profile",
    permissionWithStatus: [
      "UNVERIFY",
      "PENDING",
      "APPROVED",
      "REJECTED",
      "LOCKED",
    ],
    noNeedCheckInfo: true,
    component: Profile,
  },
  {
    path: "/payment",
    title: "payment",
    permissionWithStatus: ["APPROVED", "LOCKED"],
    component: Payment,
  },
  {
    path: "/tree",
    title: "tree",
    permissionWithStatus: ["APPROVED"],
    component: Tree,
  },
  {
    path: "/transactions",
    title: "transactions",
    permissionWithStatus: ["APPROVED"],
    component: Transactions,
  },
  {
    path: "/ref",
    title: "referral",
    permissionWithStatus: ["APPROVED"],
    component: Referral,
  },
  {
    path: "/changeWallet",
    title: "",
    permissionWithStatus: ["APPROVED"],
    component: ChangeWallet,
  },
  {
    path: "/changeUser",
    title: "changeUser",
    permissionWithStatus: ["APPROVED"],
    component: ChangeUser,
  },
  {
    path: "/legal",
    title: "legal",
    permissionWithStatus: ["APPROVED"],
    component: Legal,
  },
  {
    path: "/news",
    title: "news",
    permissionWithStatus: ["APPROVED"],
    component: News,
  },
  {
    path: "/news/:id",
    permissionWithStatus: ["APPROVED"],
    component: NewsDetails,
  },
];

export default routes;
