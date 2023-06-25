import { useDispatch } from "react-redux";
import { LOGOUT } from "@/slices/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(LOGOUT());
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
    >
      Logout
    </button>
  );
};

export default Dashboard;
