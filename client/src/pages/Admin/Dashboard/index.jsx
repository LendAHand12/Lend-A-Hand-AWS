import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "@/slices/authSlice";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(LOGOUT());
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-permissions")
          ?.actions.includes("read") && (
          <Link
            to="/admin/permissions"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("permissions")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-create-user")
          ?.actions.includes("read") && (
          <Link
            to="/admin/create-user"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("createUser")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-setting-wallet")
          ?.actions.includes("read") && (
          <Link
            to="/admin/wallet"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("settingWallet")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-setting-package")
          ?.actions.includes("read") && (
          <Link
            to="/admin/package"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("settingPackage")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-link-email")
          ?.actions.includes("read") && (
          <Link
            to="/admin/linkVerify"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("linkVerify")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-export-user")
          ?.actions.includes("read") && (
          <Link
            to="/admin/export/user"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("export users list")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-export-payment")
          ?.actions.includes("read") && (
          <Link
            to="/admin/export/payment"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("export trans list")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-list-tier")
          ?.actions.includes("read") && (
          <Link
            to="/admin/listTier"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("listTier")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-last-user-tier")
          ?.actions.includes("read") && (
          <Link
            to="/admin/lastUserTier"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("removeLastUserTier")}
          </Link>
        )}
        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-posts")
          ?.actions.includes("read") && (
          <Link
            to="/admin/posts"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("postManagement")}
          </Link>
        )}

        {userInfo?.permissions
          .find((p) => p.page.pageName === "admin-admin")
          ?.actions.includes("read") && (
          <Link
            to="/admin/admin"
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("listAdmin")}
          </Link>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex justify-center items-center hover:underline border font-bold rounded-full my-10 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
      >
        {t("logout")}
      </button>
    </>
  );
};

export default Dashboard;
