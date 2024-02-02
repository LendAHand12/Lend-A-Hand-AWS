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
const ChangeUserPage = lazy(() => import("@/pages/Admin/ChangeUser"));
const ChangeUserDetail = lazy(() => import("@/pages/Admin/ChangeUserDetail"));
const ListUserNextTier = lazy(() => import("@/pages/Admin/ListUserNextTier"));
const RemoveLastUserTier = lazy(() =>
  import("@/pages/Admin/RemoveLastUserTier")
);
const CMSPage = lazy(() => import("@/pages/Admin/CMS"));
const EditCMSPage = lazy(() => import("@/pages/Admin/EditCMS"));
const PreviewHomePage = lazy(() => import("@/pages/HomePage"));
const PreviewAboutUsPage = lazy(() => import("@/pages/AboutPage"));
const PreviewOurTeamPage = lazy(() => import("@/pages/OurTeamPage"));

const PostsPage = lazy(() => import("@/pages/Admin/Posts"));
const CreatePostsPage = lazy(() => import("@/pages/Admin/Posts/Create"));
const EditPostsPage = lazy(() => import("@/pages/Admin/Posts/Edit"));

const PermissionsPage = lazy(() => import("@/pages/Admin/Permissions"));
const PermissionsDetailsPage = lazy(() =>
  import("@/pages/Admin/Permissions/Details")
);
const PermissionsCreatePage = lazy(() =>
  import("@/pages/Admin/Permissions/Create")
);
const AdminPage = lazy(() => import("@/pages/Admin/Admin"));

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
  {
    path: "/changeUser",
    title: "changeUser",
    component: ChangeUserPage,
  },
  {
    path: "/changeUser/:id",
    component: ChangeUserDetail,
  },
  {
    path: "/listTier",
    component: ListUserNextTier,
  },
  {
    path: "/lastUserTier",
    component: RemoveLastUserTier,
  },
  {
    path: "/cms",
    title: "CMS",
    component: CMSPage,
  },
  {
    path: "/cms/:page",
    component: EditCMSPage,
  },
  {
    path: "/cms/preview/cms-homepage",
    component: PreviewHomePage,
  },
  {
    path: "/cms/preview/cms-aboutUs",
    component: PreviewAboutUsPage,
  },
  {
    path: "/cms/preview/cms-ourTeam",
    component: PreviewOurTeamPage,
  },
  {
    path: "/posts",
    component: PostsPage,
  },
  {
    path: "/posts/create",
    component: CreatePostsPage,
  },
  {
    path: "/posts/edit",
    component: EditPostsPage,
  },
  {
    path: "/permissions",
    component: PermissionsPage,
  },
  {
    path: "/permissions/create",
    component: PermissionsCreatePage,
  },
  {
    path: "/permissions/:id",
    component: PermissionsDetailsPage,
  },
  {
    path: "/admin",
    component: AdminPage,
  },
];

export default routes;
