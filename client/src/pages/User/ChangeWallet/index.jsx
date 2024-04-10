import { useState } from "react";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import queryString from "query-string";

import Loading from "@/components/Loading";
import User from "@/api/User";
import { useSelector } from "react-redux";

const ChangeWallet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const {
    userInfo: {
      walletAddress1,
      walletAddress2,
      walletAddress3,
      walletAddress4,
      walletAddress5,
    },
  } = useSelector((state) => state.auth);
  let { token } = parsed;
  if (!token) {
    toast.error(t("invalidUrl"));
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newWallet1: walletAddress1,
      newWallet2: walletAddress2,
      newWallet3: walletAddress3,
      newWallet4: walletAddress4,
      newWallet5: walletAddress5,
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const { newWallet1, newWallet2, newWallet3, newWallet4, newWallet5 } = data;
    await User.changeWallet({
      token,
      newWallet1,
      newWallet2,
      newWallet3,
      newWallet4,
      newWallet5,
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
                    <div className="mb-6">
                      <div className="font-semibold">
                        {t("walletAddress")} Tier 1
                      </div>
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
                        type="text"
                        placeholder="Wallet address : Oxbx7..."
                        {...register("newWallet1", {
                          required: t("Wallet address is required"),
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/g,
                            message: t(
                              "Please enter the correct wallet format"
                            ),
                          },
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.newWallet1?.message}
                      </p>
                    </div>
                    <div className="mb-6">
                      <div className="font-semibold">
                        {t("walletAddress")} Tier 2
                      </div>
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
                        type="text"
                        placeholder="Wallet address : Oxbx7..."
                        {...register("newWallet2", {
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/g,
                            message: t(
                              "Please enter the correct wallet format"
                            ),
                          },
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.newWallet2?.message}
                      </p>
                    </div>
                    <div className="mb-6">
                      <div className="font-semibold">
                        {t("walletAddress")} Tier 3
                      </div>
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
                        type="text"
                        placeholder="Wallet address : Oxbx7..."
                        {...register("newWallet3", {
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/g,
                            message: t(
                              "Please enter the correct wallet format"
                            ),
                          },
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.newWallet3?.message}
                      </p>
                    </div>
                    <div className="mb-6">
                      <div className="font-semibold">
                        {t("walletAddress")} Tier 4
                      </div>
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
                        type="text"
                        placeholder="Wallet address : Oxbx7..."
                        {...register("newWallet4", {
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/g,
                            message: t(
                              "Please enter the correct wallet format"
                            ),
                          },
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.newWallet4?.message}
                      </p>
                    </div>
                    <div className="mb-6">
                      <div className="font-semibold">
                        {t("walletAddress")} Tier 5
                      </div>
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2"
                        type="text"
                        placeholder="Wallet address : Oxbx7..."
                        {...register("newWallet5", {
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/g,
                            message: t(
                              "Please enter the correct wallet format"
                            ),
                          },
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.newWallet5?.message}
                      </p>
                    </div>

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
