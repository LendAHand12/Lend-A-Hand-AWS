import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDisconnect } from "wagmi";
import axios from "axios";

import User from "@/api/User";
import Loading from "@/components/Loading";
import { LOGOUT, UPDATE_USER_INFO } from "@/slices/authSlice";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const [loadingUploadFileFront, setLoadingUploadFileFront] = useState(false);
  const [loadingUploadFileBack, setLoadingUploadFileBack] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  let {
    email,
    userId,
    walletAddress,
    createdAt,
    id,
    status,
    tier,
    fine,
    countPay,
    listDirectUser,
  } = userInfo;
  const [imgFront, setImgFront] = useState("");
  const [imgBack, setImgBack] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      walletAddress: walletAddress,
      imgBackData: "",
      imgFrontData: "",
    },
  });
  const { disconnect } = useDisconnect();

  const handleLogout = () => {
    disconnect();
    dispatch(LOGOUT());
  };

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
        console.log(error);
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

  const onSubmit = useCallback(
    async (data) => {
      const { walletAddress } = data;
      setLoading(true);
      await User.update(id, {
        walletAddress: walletAddress.trim(),
        imgFront,
        imgBack,
      })
        .then((response) => {
          setLoading(false);
          toast.success(t(response.data.message));
          dispatch(UPDATE_USER_INFO(response.data.data));
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.error
              ? error.response.data.error
              : error.message;
          toast.error(t(message));
          setLoading(false);
        });
    },
    [imgFront, imgBack]
  );

  return (
    <div>
      <ToastContainer />
      <div className="container mx-auto p-5">
        {status === "UNVERIFY" && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5"
            role="alert"
          >
            <span className="block sm:inline">{t("verifyAccountAlert")}</span>
          </div>
        )}

        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full lg:w-3/12 lg:mx-2 mb-4 lg:mb-0">
            <div className="bg-white shadow-md p-3 border-t-4 border-primary">
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>{t("status")}</span>
                  <span className="ml-auto">
                    <span
                      className={`${
                        status === "UNVERIFY"
                          ? "bg-red-600"
                          : status === "PENDING"
                          ? "bg-yellow-600"
                          : status === "APPROVED"
                          ? "bg-green-600"
                          : status === "REJECTED"
                          ? "bg-red-600"
                          : status === "LOCKED"
                          ? "bg-red-600"
                          : ""
                      }  py-1 px-2 rounded text-white text-sm`}
                    >
                      {t(status)}
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>{t("memberSince")}</span>
                  <span className="ml-auto">
                    {new Date(createdAt).toLocaleDateString("vi")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full lg:w-9/12 lg:mx-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="bg-white p-6 shadow-md rounded-sm border-t-4 border-primary"
            >
              <div className="text-gray-700">
                <div className="grid grid-cols-1 text-sm">
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("ref code")}
                    </div>
                    <div className="px-4 py-2">{id}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("username")}
                    </div>
                    <div className="px-4 py-2">{userId}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div className="px-4 py-2">{email}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("walletAddress")}
                    </div>
                    <div className="">
                      {/* <input
                        className="w-full px-4 py-1 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        {...register("walletAddress", {
                          required: "Wallet address is required",
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/g,
                            message: t(
                              "Please enter the correct wallet format"
                            ),
                          },
                        })}
                      />
                      <p className="error-message-text">
                        {errors.walletAddress?.message}
                      </p> */}
                      <div className="px-4 py-2">{walletAddress}</div>
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("count pay")}
                    </div>
                    <div className="px-4 py-2">
                      {countPay} {t("times")}
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">Tier</div>
                    <div className="px-4 py-2">{tier}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">{t("fine")}</div>
                    <div className="px-4 py-2">{fine}</div>
                  </div>
                  {status === "APPROVED" && listDirectUser.length > 0 && (
                    <>
                      <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="px-4 py-2 font-semibold">
                          {t("children")}
                        </div>
                        <div className="px-4 py-2">
                          <ul>
                            {listDirectUser.map((ele) => (
                              <li
                                className="bg-white border-b hover:bg-gray-50"
                                key={ele._id}
                              >
                                <div className="py-2">
                                  <div className="text-base">
                                    <span className="font-semibold">
                                      {ele.userId}
                                    </span>
                                    {/* <br></br>
                                    {ele._id}
                                    <br></br>
                                    {ele.email}
                                    <br></br>
                                    {ele.walletAddress}
                                    <br></br> */}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                  {status === "UNVERIFY" ? (
                    <>
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
                                    if (file && file.type.match("image.*")) {
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
                                    if (file && file.type.match("image.*")) {
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
                    </>
                  ) : (
                    <>
                      <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="px-4 py-2 font-semibold">
                          {t("idCardFront")}
                        </div>
                        <img
                          src={`${userInfo.imgFront}`}
                          className="w-full px-4 py-2"
                        />
                      </div>
                      <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="px-4 py-2 font-semibold">
                          {t("idCardBack")}
                        </div>
                        <img
                          src={`${userInfo.imgBack}`}
                          className="w-full px-4 py-2"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={
                  loading || loadingUploadFileFront || loadingUploadFileBack
                }
                className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {loading && <Loading />}
                {t("update")}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {t("logout")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
