import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link, useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import queryString from "query-string";
import PhoneInput from "react-phone-number-input";

import Layout from "@/containers/layout";
import Loading from "@/components/Loading";
import Auth from "@/api/Auth";

import "react-phone-number-input/style.css";
import "./index.css";

const Register = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  let { ref, receiveId } = parsed;
  if (!receiveId) {
    receiveId = ref;
  }
  const history = useHistory();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ref,
      receiveId,
    },
  });
  const [loading, setLoading] = useState(false);
  const [checkingRefUrl, setCheckingRefUrl] = useState(true);
  const [phone, setPhone] = useState("");
  const [errorPhone, setErrPhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = useCallback(
    async (data) => {
      if (phone === "") {
        setErrPhone(true);
        return;
      }
      setLoading(true);
      const { userId, email, password, ref, receiveId, walletAddress, idCode } =
        data;
      await Auth.register({
        userId: userId.trim(),
        email: email.trim(),
        password,
        ref,
        receiveId,
        walletAddress: walletAddress.trim(),
        phone: phone.trim(),
        idCode: idCode.trim(),
      })
        .then((response) => {
          setLoading(false);
          toast.success(t(response.data.message));
          setTimeout(() => {
            history.push("/");
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
    },
    [phone]
  );

  useEffect(() => {
    (async () => {
      await Auth.checkLinkRef({ ref, receiveId })
        .then(() => setCheckingRefUrl(false))
        .catch((error) => {
          let message =
            error.response && error.response.data.error
              ? error.response.data.error
              : error.message;
          toast.error(t(message));
        });
    })();
  }, [ref, receiveId]);

  return (
    <Layout>
      <ToastContainer />
      <div className="min-h-screen bg-white">
        {!checkingRefUrl && (
          <div className="text-gray-900 flex justify-center bg-white">
            <div className="max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1">
              <div className="w-full p-12">
                <div className="mt-12 flex flex-col items-center">
                  <h1 className="text-2xl xl:text-3xl font-extrabold">
                    {t("register")}
                  </h1>
                  <div className="w-full flex-1 mt-8">
                    <form
                      className="mx-auto max-w-xl"
                      onSubmit={handleSubmit(onSubmit)}
                      autoComplete="off"
                    >
                      {/* User ID */}
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="text"
                        placeholder={t("user name")}
                        {...register("userId", {
                          required: t("User ID is required"),
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.userId?.message}
                      </p>
                      {/* Email */}
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                          required: t("Email is required"),
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.email?.message}
                      </p>
                      {/* Phone */}
                      {/* <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="text"
                        placeholder={t("phone")}
                        {...register("phone", {
                          required: t("Phone is required"),
                          pattern: {
                            value: /(0[3|5|7|8|9])+([0-9]{8})\b/g,
                            message: t("Please enter the correct phone format"),
                          },
                        })}
                        disabled={loading}
                      /> */}
                      <PhoneInput
                        defaultCountry="VN"
                        placeholder={t("phone")}
                        value={phone}
                        onChange={setPhone}
                      />
                      <p className="error-message-text">
                        {errorPhone && t("Phone is required")}
                      </p>
                      {/* Id code */}
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="text"
                        placeholder={`${t("id code")}`}
                        {...register("idCode", {
                          required: t("id code is required"),
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.idCode?.message}
                      </p>
                      {/* Wallet address */}
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="text"
                        placeholder={`${t("wallet address")} : Oxbx7...`}
                        {...register("walletAddress", {
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
                        {errors.walletAddress?.message}
                      </p>
                      {/* Password */}
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("password")}
                        {...register("password", {
                          required: t("Password is required"),
                          pattern: {
                            value: /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                            message: t(
                              "Password must contain at least 8 characters and a number"
                            ),
                          },
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.password?.message}
                      </p>
                      <div
                        className="mt-2 text-primary hover:underline cursor-pointer text-xs"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? t("hide password") : t("show password")}
                      </div>
                      {/* Confirm Password */}
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="password"
                        placeholder={t("confirm password")}
                        {...register("confirmPassword", {
                          required: t("Confirm password is required"),
                          validate: (val) => {
                            if (watch("password") != val) {
                              return t("Your passwords do no match");
                            }
                          },
                          pattern: {
                            value: /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
                            message: t(
                              "Password must contain at least 8 characters and a number"
                            ),
                          },
                        })}
                        disabled={loading}
                      />
                      <p className="error-message-text">
                        {errors.confirmPassword?.message}
                      </p>
                      <button
                        type="submit"
                        className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                      >
                        {loading && <Loading />}
                        {t("confirm")}
                      </button>
                      <p className="mt-4 text-gray-600">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-primary hover:underline"
                        >
                          Login
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Register;
