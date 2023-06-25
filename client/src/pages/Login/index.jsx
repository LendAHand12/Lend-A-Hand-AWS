import Layout from "@/containers/layout";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import Auth from "@/api/Auth";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { LOGIN } from "@/slices/authSlice";
import Loading from "@/components/Loading";

const Login = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = async (data) => {
    const { code, password } = data;
    setLoading(true);
    await Auth.login({ code, password })
      .then((response) => {
        setLoading(false);
        dispatch(LOGIN(response.data));
        history.push("/");
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
        setLoading(false);
      });
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="text-gray-900 flex justify-center bg-white">
        <div className="max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1">
          <div className="w-full p-12">
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">
                {t("login")}
              </h1>
              <div className="w-full flex-1 mt-8">
                <form
                  className="mx-auto max-w-xl"
                  onSubmit={handleSubmit(onSubmit)}
                  autoComplete="off"
                >
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Email/User Name"
                    {...register("code", {
                      required: "Email/User ID is required",
                    })}
                  />
                  <p className="error-message-text">{errors.code?.message}</p>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
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
                  />
                  <p className="error-message-text">
                    {errors.password?.message}
                  </p>
                  <div className="mt-5 flex items-center justify-between ">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 accent-primary text-white border-primary rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900 "
                      >
                        {t("rememberMe")}
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="font-medium text-primary hover:underline"
                      >
                        {t("forgotPassword")}?
                      </Link>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {loading && <Loading />}
                    {t("confirm")}
                  </button>
                  {/* <p className="mt-4 text-gray-600">
                    Don’t have an account yet?{" "}
                    <Link
                      to="/register"
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </p> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
