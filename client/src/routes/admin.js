import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const Users = lazy(() => import("@/pages/Admin/Users"));
const UserProfile = lazy(() => import("@/pages/Admin/UserProfile"));
const Transactions = lazy(() => import("@/pages/Admin/Transactions"));
const Tree = lazy(() => import("@/pages/Admin/Tree"));
const GetVerifyLink = lazy(() => import("@/pages/Admin/GetVerifyLink"));

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
    title: "tree",
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
    path: "/linkVerify",
    title: "linkVerify",
    component: GetVerifyLink,
  },
];

export default routes;
