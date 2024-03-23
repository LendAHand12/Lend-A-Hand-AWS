import Wallet from "@/api/Wallet";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SettingPage = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const onSubmit = async (values) => {
    setSubmiting(true);
    const wallets = Object.entries(values).map(([key, value]) => ({
      type: key,
      address: value,
    }));
    await Wallet.updateWallets({ wallets })
      .then((response) => {
        toast.success(t(response.data.message));
        setSubmiting(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setSubmiting(false);
      });
  };

  useEffect(() => {
    (async () => {
      await Wallet.getAllWallets()
        .then((response) => {
          for (let wallet of response.data.wallets) {
            setValue(wallet.type, wallet.address);
          }
          setLoading(false);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
          setLoading(false);
        });
    })();
  }, []);

  return (
    <div className="text-gray-900 flex justify-center bg-white">
      <div className="max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1">
        <div className="w-full p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {t("settingWallet")}
            </h1>

            <div className="w-full flex-1 mt-8">
              <form
                className="mx-auto max-w-xl"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
              >
                <div className="w-full flex flex-col mb-4">
                  <span className="font-semibold">
                    {t("walletAddress")} {t("register")} :
                  </span>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder={`Oxbx7...`}
                    {...register("REGISTER", {
                      required: t("Wallet address is required"),
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/g,
                        message: t("Please enter the correct wallet format"),
                      },
                    })}
                    disabled={submiting}
                  />
                  <p className="error-message-text">
                    {errors.REGISTER?.message}
                  </p>
                </div>
                <div className="w-full flex flex-col mb-4">
                  <span className="font-semibold">
                    {t("walletAddress")} Admin :
                  </span>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder={`Oxbx7...`}
                    {...register("ADMIN", {
                      required: t("Wallet address is required"),
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/g,
                        message: t("Please enter the correct wallet format"),
                      },
                    })}
                    disabled={submiting}
                  />
                  <p className="error-message-text">{errors.ADMIN?.message}</p>
                </div>
                <div className="w-full flex flex-col mb-4">
                  <span className="font-semibold">
                    {t("walletAddress")} Hold Tier 1 :
                  </span>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder={`Oxbx7...`}
                    {...register("HOLD1", {
                      required: t("Wallet address is required"),
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/g,
                        message: t("Please enter the correct wallet format"),
                      },
                    })}
                    disabled={submiting}
                  />
                  <p className="error-message-text">{errors.HOLD1?.message}</p>
                </div>
                <div className="w-full flex flex-col mb-4">
                  <span className="font-semibold">
                    {t("walletAddress")} Hold Tier 2 :
                  </span>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder={`Oxbx7...`}
                    {...register("HOLD2", {
                      required: t("Wallet address is required"),
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/g,
                        message: t("Please enter the correct wallet format"),
                      },
                    })}
                    disabled={submiting}
                  />
                  <p className="error-message-text">{errors.HOLD2?.message}</p>
                </div>
                <div className="w-full flex flex-col mb-4">
                  <span className="font-semibold">
                    {t("walletAddress")} Hold Tier 3 :
                  </span>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder={`Oxbx7...`}
                    {...register("HOLD3", {
                      required: t("Wallet address is required"),
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/g,
                        message: t("Please enter the correct wallet format"),
                      },
                    })}
                    disabled={submiting}
                  />
                  <p className="error-message-text">{errors.HOLD3?.message}</p>
                </div>
                <div className="w-full flex flex-col mb-4">
                  <span className="font-semibold">
                    {t("walletAddress")} Hold Tier 4 :
                  </span>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder={`Oxbx7...`}
                    {...register("HOLD4", {
                      required: t("Wallet address is required"),
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/g,
                        message: t("Please enter the correct wallet format"),
                      },
                    })}
                    disabled={submiting}
                  />
                  <p className="error-message-text">{errors.HOLD4?.message}</p>
                </div>
                <div className="w-full flex flex-col mb-4">
                  <span className="font-semibold">
                    {t("walletAddress")} Hold Tier 5 :
                  </span>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder={`Oxbx7...`}
                    {...register("HOLD5", {
                      required: t("Wallet address is required"),
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/g,
                        message: t("Please enter the correct wallet format"),
                      },
                    })}
                    disabled={submiting}
                  />
                  <p className="error-message-text">{errors.HOLD5?.message}</p>
                </div>
                {userInfo?.permissions
                  .find((p) => p.page.pageName === "admin-setting-wallet")
                  ?.actions.includes("update") && (
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {submiting && <Loading />}
                    {t("confirm")}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
