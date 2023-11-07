import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const Users = lazy(() => import("@/pages/Admin/Users"));
const UserProfile = lazy(() => import("@/pages/Admin/UserProfile"));
const Transactions = lazy(() => import("@/pages/Admin/Transactions"));
const Tree = lazy(() => import("@/pages/Admin/Tree"));
const GetVerifyLink = lazy(() => import("@/pages/Admin/GetVerifyLink"));
const TransactionDetail = lazy(() => import("@/pages/Admin/TransactionDetail"));
const Trash = lazy(() => import("@/pages/Admin/Trash"));
const ExportPayment = lazy(() => import("@/pages/Admin/Export/ExportPayment"));
const ExportUser = lazy(() => import("@/pages/Admin/Export/ExportUser"));
const SettingPackage = lazy(() => import("@/pages/Admin/SettingPackage"));
const SettingWallet = lazy(() => import("@/pages/Admin/SettingWallet"));
const CreateUserPage = lazy(() => import("@/pages/Admin/CreateUser"));

const routes = [
  {
    path: "/dashboard",
    title: "dashboard",
    component: Dashboard,
  },
  {
    path: "/users",
    title: "users",
    component: Users,
  },
  {
    path: "/tree/:id",
    component: Tree,
  },
  {
    path: "/users/:id",
    component: UserProfile,
  },
  {
    path: "/transactions",
    title: "transactions",
    component: Transactions,
  },
  {
    path: "/transactions/:id",
    component: TransactionDetail,
  },
  // {
  //   path: "/system",
  //   title: "tree",
  //   component: System,
  // },
  {
    path: "/trash",
    title: "trash",
    component: Trash,
  },
  {
    path: "/linkVerify",
    component: GetVerifyLink,
  },
  {
    path: "/package",
    component: SettingPackage,
  },
  {
    path: "/wallet",
    component: SettingWallet,
  },
  {
    path: "/create-user",
    component: CreateUserPage,
  },
  {
    path: "/export/payment",
    component: ExportPayment,
  },
  {
    path: "/export/user",
    component: ExportUser,
  },
];

export default routes;
