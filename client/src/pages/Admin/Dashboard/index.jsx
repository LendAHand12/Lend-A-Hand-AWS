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
      <Link
        to="/admin/create-user"
        className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
      >
        {t("createUser")}
      </Link>
      <Link
        to="/admin/setting"
        className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
      >
        {t("setting")}
      </Link>
      <Link
        to="/admin/linkVerify"
        className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
      >
        {t("linkVerify")}
      </Link>
      <button
        onClick={handleLogout}
        className="w-full flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
      >
        {t("logout")}
      </button>
    </>
  );
};

export default Dashboard;
