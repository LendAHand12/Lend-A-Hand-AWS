import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-number-input";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Loading from "@/components/Loading";
import ChangeUser from "@/api/ChangeUser";

import "react-phone-number-input/style.css";
import "./index.css";

const ChangeUserPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [errorPhone, setErrPhone] = useState(false);
  const [imgFront, setImgFront] = useState("");
  const [imgBack, setImgBack] = useState("");
  const [loadingUploadFileFront, setLoadingUploadFileFront] = useState(false);
  const [loadingUploadFileBack, setLoadingUploadFileBack] = useState(false);
  const [loadingChangeUserData, setLoadingChangeUserData] = useState(true);
  const [changeUserData, setChangeUserData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      await ChangeUser.getByUser()
        .then((response) => {
          setChangeUserData(response.data.changeUser);
          setLoadingChangeUserData(false);
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

    fetch();
  }, [refresh]);

  const onSubmit = useCallback(
    async (data) => {
      if (phone === "") {
        setErrPhone(true);
        return;
      }
      setLoading(true);

      await ChangeUser.create({
        newUserId: data.newUserId.trim(),
        newEmail: data.newEmail.trim(),
        newIdCode: data.newIdCode.trim(),
        newPhone: phone,
        newImgFront: imgFront,
        newImgBack: imgBack,
        newWalletAddress: data.newWalletAddress.trim(),
        phone: phone.trim(),
        reasonRequest: data.reasonRequest.trim(),
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
    [phone, imgFront, imgBack]
  );

  const uploadFile = (file, forData) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sdblmpca");

    if (forData === "front") {
      setLoadingUploadFileFront(true);
    } else {
      setLoadingUploadFileBack(true);
    }
    axios
      .post(`${import.meta.env.VITE_CLOUDINARY_URL}/image/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (forData === "front") {
          setLoadingUploadFileFront(false);
          setImgFront(response.data.secure_url);
        } else {
          setLoadingUploadFileBack(false);
          setImgBack(response.data.secure_url);
        }
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(message);
        if (forData === "front") {
          setLoadingUploadFileFront(false);
        } else {
          setLoadingUploadFileBack(false);
        }
      });
  };

  const handleCancel = async () => {
    setLoading(true);
    await ChangeUser.cancel()
      .then(() => {
        setRefresh(!refresh);
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
                  {t("changeUserLong")}
                </h1>
                {loadingChangeUserData ? (
                  <div className="mt-4">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {changeUserData ? (
                      <div className="mt-4">
                        {changeUserData.status === "PENDING" && (
                          <div
                            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-5"
                            role="alert"
                          >
                            <span className="block sm:inline">
                              {t("changeUserPendingDesc")}
                            </span>
                          </div>
                        )}
                        {changeUserData.status === "REJECTED" && (
                          <div>
                            <div
                              className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5"
                              role="alert"
                            >
                              <span className="block sm:inline">
                                {t("changeUserRejectedDesc")}
                              </span>
                            </div>
                            <div>
                              <strong>{t("reason")} :</strong>
                              <p>{changeUserData.reasonReject}</p>
                            </div>
                            <button
                              onClick={handleCancel}
                              className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                            >
                              {loading ? <Loading /> : t("tryAgain")}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex-1 mt-8">
                        <form
                          className="mx-auto max-w-xl"
                          onSubmit={handleSubmit(onSubmit)}
                          autoComplete="off"
                          encType="multipart/form-data"
                        >
                          {/* User ID */}
                          <input
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            type="text"
                            placeholder={t("new user name")}
                            {...register("newUserId", {
                              required: t("User ID is required"),
                            })}
                            disabled={loading}
                          />
                          <p className="error-message-text">
                            {errors.newUserId?.message}
                          </p>
                          {/* Email */}
                          <input
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                            type="email"
                            placeholder={t("new email")}
                            {...register("newEmail", {
                              required: t("Email is required"),
                            })}
                            disabled={loading}
                          />
                          <p className="error-message-text">
                            {errors.newEmail?.message}
                          </p>
                          <PhoneInput
                            defaultCountry="VN"
                            placeholder={t("new phone")}
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
                            placeholder={`${t("new id code")}`}
                            {...register("newIdCode", {
                              required: t("id code is required"),
                            })}
                            disabled={loading}
                          />
                          <p className="error-message-text">
                            {errors.newIdCode?.message}
                          </p>
                          {/* Wallet address */}
                          <input
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                            type="text"
                            placeholder={`${t(
                              "new wallet address"
                            )} : Oxbx7...`}
                            {...register("newWalletAddress", {
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
                            {errors.newWalletAddress?.message}
                          </p>
                          <textarea
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                            type="text"
                            placeholder={`${t("reason")}`}
                            {...register("reasonRequest", {
                              required: t("reason is required"),
                            })}
                            disabled={loading}
                          />
                          <p className="error-message-text">
                            {errors.reasonRequest?.message}
                          </p>
                          <div className="flex justify-center my-4">
                            <div className="max-w-2xl rounded-lg shadow-xl bg-gray-50">
                              <div className="m-4">
                                <label className="inline-block mb-2 text-gray-500">
                                  {t("idCardFront")}
                                </label>
                                <div className="flex flex-col items-center justify-center w-full">
                                  <label className="flex flex-col w-full h-40 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                    {imgFront !== "" ? (
                                      <img
                                        src={imgFront}
                                        className="w-full h-full"
                                        alt="the front of identity card"
                                      />
                                    ) : (
                                      <div className="flex flex-col items-center justify-center pt-7">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                          />
                                        </svg>
                                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                          {loadingUploadFileFront
                                            ? "Uploading..."
                                            : "Attach a file"}
                                        </p>
                                      </div>
                                    )}
                                    <input
                                      // {...register("imgFrontData", {
                                      //   required:
                                      //     "The front of identity card is required",
                                      // })}
                                      type="file"
                                      onChange={(e) => {
                                        e.preventDefault();
                                        let file = e.target.files[0];
                                        if (
                                          file &&
                                          file.type.match("image.*")
                                        ) {
                                          uploadFile(file, "front");
                                        }
                                      }}
                                      accept="image/png, imgage/jpg, image/jpeg"
                                      className="opacity-0"
                                    />
                                  </label>
                                  <p className="error-message-text">
                                    {errors.imgFrontData?.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center my-4">
                            <div className="max-w-2xl rounded-lg shadow-xl bg-gray-50">
                              <div className="m-4">
                                <label className="inline-block mb-2 text-gray-500">
                                  {t("idCardBack")}
                                </label>
                                <div className="flex flex-col items-center justify-center w-full">
                                  <label className="flex flex-col w-full h-40 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                    {imgBack !== "" ? (
                                      <img
                                        src={imgBack}
                                        className="w-full h-full"
                                        alt="the back of identity card"
                                      />
                                    ) : (
                                      <div className="flex flex-col items-center justify-center pt-7">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                          />
                                        </svg>
                                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                          {loadingUploadFileBack
                                            ? "Uploading..."
                                            : "Attach a file"}
                                        </p>
                                      </div>
                                    )}
                                    <input
                                      // {...register("imgBackData", {
                                      //   required:
                                      //     "The back of identity card is required",
                                      // })}
                                      type="file"
                                      onChange={(e) => {
                                        e.preventDefault();
                                        let file = e.target.files[0];
                                        if (
                                          file &&
                                          file.type.match("image.*")
                                        ) {
                                          uploadFile(file, "back");
                                        }
                                      }}
                                      accept="image/png, imgage/jpg, image/jpeg"
                                      className="opacity-0"
                                    />
                                  </label>
                                  <p className="error-message-text">
                                    {errors.imgBackData?.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex mt-6 gap-4">
                            <div>
                              <input
                                type="checkbox"
                                {...register("accept", {
                                  required: t("accept is required"),
                                })}
                              />
                            </div>
                            <div>
                              <p className=" text-gray-600">
                                {t("changeUserCommit")}
                              </p>
                            </div>
                          </div>
                          <p className="error-message-text">
                            {errors.accept?.message}
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
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeUserPage;
