import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import queryString from "query-string";

import Loading from "@/components/Loading";
import User from "@/api/User";

const ChangeWallet = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  let { token } = parsed;
  if (!token) {
    toast.error(t("invalidUrl"));
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const { newWallet } = data;
    await User.changeWallet({
      token,
      newWallet,
    })
      .then((response) => {
        setLoading(false);
        toast.success(t(response.data.message));
        setTimeout(() => {
          window.location.replace("/user");
        }, 2000);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoading(false);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-white">
        <div className="text-gray-900 flex justify-center bg-white">
          <div className="max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1">
            <div className="w-full p-12">
              <div className="mt-12 flex flex-col items-center">
                <h1 className="text-2xl xl:text-3xl font-extrabold">
                  {t("change wallet")}
                </h1>
                <div className="w-full flex-1 mt-8">
                  <form
                    className="mx-auto max-w-xl"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                  >
                    {/* Password */}
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="text"
                      placeholder="Wallet address : Oxbx7..."
                      {...register("newWallet", {
                        required: t("Wallet address is required"),
                        pattern: {
                          value: /^0x[a-fA-F0-9]{40}$/g,
                          message: t("Please enter the correct wallet format"),
                        },
                      })}
                      disabled={loading}
                    />
                    <p className="error-message-text">
                      {errors.newWallet?.message}
                    </p>
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    >
                      {loading && <Loading />}
                      {t("confirm")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeWallet;
