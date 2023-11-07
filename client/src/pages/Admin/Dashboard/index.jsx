import { useDispatch } from "react-redux";
import { LOGOUT } from "@/slices/authSlice";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(LOGOUT());
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <Link
          to="/admin/create-user"
          className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          {t("createUser")}
        </Link>
        <Link
          to="/admin/wallet"
          className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          {t("settingWallet")}
        </Link>
        <Link
          to="/admin/package"
          className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          {t("settingPackage")}
        </Link>
        <Link
          to="/admin/linkVerify"
          className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          {t("linkVerify")}
        </Link>
        <Link
          to="/admin/export/user"
          className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          {t("export users list")}
        </Link>
        <Link
          to="/admin/export/payment"
          className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          {t("export trans list")}
        </Link>
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
