import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDisconnect } from "wagmi";
import axios from "axios";

import User from "@/api/User";
import Loading from "@/components/Loading";
import { LOGOUT, UPDATE_USER_INFO } from "@/slices/authSlice";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { confirmAlert } from "react-confirm-alert";
import UploadFile from "./UploadInfo";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./index.css";

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const [loadingChangeWallet, setLoadingChangeWallet] = useState(false);
  const [loadingUploadFileFront, setLoadingUploadFileFront] = useState(false);
  const [loadingUploadFileBack, setLoadingUploadFileBack] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  let {
    email,
    userId,
    walletAddress1,
    walletAddress2,
    walletAddress3,
    walletAddress4,
    walletAddress5,
    createdAt,
    id,
    status,
    tier,
    fine,
    countPay,
    listDirectUser,
    phone,
    idCode,
    buyPackage,
    packages,
    tier1Time,
    tier2Time,
    tier3Time,
    tier4Time,
    tier5Time,
    isSerepayWallet,
  } = userInfo;
  const [imgFront, setImgFront] = useState("");
  const [imgBack, setImgBack] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [errorPhone, setErrPhone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idCode,
      phone,
      imgBack: "",
      imgFront: "",
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
      const { idCode } = data;
      if (!phoneNumber || phoneNumber === "") {
        setErrPhone(true);
      } else {
        setErrPhone(false);
        setLoading(true);

        var formData = new FormData();

        const { imgFront } = data;
        const [fileObjectImgFront] = imgFront;

        const { imgBack } = data;
        const [fileObjectImgBack] = imgBack;

        formData.append("phone", phoneNumber.trim());
        formData.append("idCode", idCode.trim());
        formData.append("imgFront", fileObjectImgFront);
        formData.append("imgBack", fileObjectImgBack);

        await User.update(id, formData)
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
      }
    },
    [imgFront, imgBack, phoneNumber]
  );

  const handleChangeWallet = async () => {
    setLoadingChangeWallet(true);
    await User.getMailChangeWallet()
      .then((response) => {
        setLoadingChangeWallet(false);
        toast.success(t(response.data.message));
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingChangeWallet(false);
      });
  };

  const handleChoosePaymentMethod = async (buyPackage, onClose) => {
    await User.update(id, {
      buyPackage,
    })
      .then((response) => {
        toast.success(t(response.data.message));
        dispatch(UPDATE_USER_INFO(response.data.data));
        onClose();
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error ? error.response.data.error : error.message;
        toast.error(t(message));
        setLoading(false);
      });
  };

  useEffect(() => {
    if (countPay === 0 && status === "APPROVED" && buyPackage === "") {
      confirmAlert({
        closeOnClickOutside: false,
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <div className="p-6 bg-gray-50 md:mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 mx-auto my-6 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
                <div className="text-center">
                  <p className="my-4 text-xl text-gray-600">{t("choosePaymentMethod")}</p>
                  <div className="flex gap-10 mt-10 text-center">
                    {packages.find((ele) => ele === "A") && (
                      <button
                        onClick={() => handleChoosePaymentMethod("A", onClose)}
                        className="flex items-center justify-center w-48 px-8 py-4 font-bold text-white transition duration-300 ease-in-out transform rounded-full shadow-lg hover:underline gradient focus:outline-none focus:shadow-outline hover:scale-105"
                      >
                        {t("buyPackage")} A
                      </button>
                    )}
                    {packages.find((ele) => ele === "B") && (
                      <button
                        onClick={() => handleChoosePaymentMethod("B", onClose)}
                        className="flex items-center justify-center w-48 px-8 py-4 font-bold text-white transition duration-300 ease-in-out transform rounded-full shadow-lg hover:underline gradient focus:outline-none focus:shadow-outline hover:scale-105"
                      >
                        {t("buyPackage")} B
                      </button>
                    )}
                  </div>
                  {packages.find((ele) => ele === "C") && (
                    <button
                      onClick={() => handleChoosePaymentMethod("C", onClose)}
                      className="flex items-center justify-center w-full px-8 py-4 mt-10 font-bold text-white transition duration-300 ease-in-out transform bg-red-500 rounded-full shadow-lg hover:underline focus:outline-none focus:shadow-outline hover:scale-105"
                    >
                      {t("skip")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        },
      });
    }
  }, [packages]);

  return (
    <div>
      <ToastContainer />
      <div className="container p-5 mx-auto">
        {status === "UNVERIFY" && (
          <div
            className="relative px-4 py-3 mb-5 text-red-700 bg-red-100 border border-red-400 rounded"
            role="alert"
          >
            <span className="block sm:inline">{t("verifyAccountAlert")}</span>
          </div>
        )}

        {(phone === "" || idCode === "") && (
          <div
            className="relative px-4 py-3 mb-5 text-red-700 bg-red-100 border border-red-400 rounded"
            role="alert"
          >
            <span className="block sm:inline">{t("infoAccountAlert")}</span>
          </div>
        )}

        {/* {!isSerepayWallet && (
          <div
            className="relative px-4 py-3 mb-5 text-red-700 bg-red-100 border border-red-400 rounded"
            role="alert"
          >
            <span className="block sm:inline">
              {t("isNotSerepayWalletAlert")}{" "}
              <span className="underline">
                <a
                  download
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`${
                    import.meta.env.VITE_API_URL
                  }/documents/SEREPAY_DOCUMENT.pdf`}
                >
                  {t("download")}
                </a>
              </span>
            </span>
          </div>
        )} */}
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full mb-4 lg:w-3/12 lg:mx-2 lg:mb-0">
            <div className="p-3 bg-white border-t-4 shadow-md border-primary">
              <ul className="px-3 py-2 mt-3 text-gray-600 bg-gray-100 divide-y rounded shadow-sm hover:text-gray-700 hover:shadow">
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
                  <span className="ml-auto">{new Date(createdAt).toLocaleDateString("vi")}</span>
                </li>
                <li className="flex items-center py-3">
                  <span>{t("tier1Time")}</span>
                  <span className="ml-auto">
                    {tier1Time ? new Date(tier1Time).toLocaleDateString("vi") : ""}
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>{t("tier2Time")}</span>
                  <span className="ml-auto">
                    {tier2Time ? new Date(tier2Time).toLocaleDateString("vi") : ""}
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>{t("tier3Time")}</span>
                  <span className="ml-auto">
                    {tier3Time ? new Date(tier3Time).toLocaleDateString("vi") : ""}
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>{t("tier4Time")}</span>
                  <span className="ml-auto">
                    {tier4Time ? new Date(tier4Time).toLocaleDateString("vi") : ""}
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>{t("tier5Time")}</span>
                  <span className="ml-auto">
                    {tier5Time ? new Date(tier1Time).toLocaleDateString("vi") : ""}
                  </span>
                </li>
              </ul>
            </div>
            {status === "APPROVED" && (
              <div className="p-3 mt-10 bg-white border-t-4 shadow-md border-primary">
                <p className="mt-2 font-bold uppercase">{t("children")}</p>
                <div className="py-2">
                  <ul>
                    {listDirectUser.map((ele) => (
                      <li className="bg-white border-b hover:bg-gray-50" key={ele._id}>
                        <div className="py-2">
                          <div className="text-base">
                            <span
                              className={`${
                                ele.isGray
                                  ? "bg-[#8c8c8c]"
                                  : ele.isRed
                                  ? "bg-[#b91c1c]"
                                  : ele.isYellow
                                  ? "bg-[#F4B400]"
                                  : "bg-[#16a34a]"
                              } py-1 px-2 rounded text-white text-sm`}
                            >
                              {ele.userId}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="w-full lg:w-9/12 lg:mx-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="p-6 bg-white border-t-4 rounded-sm shadow-md border-primary"
            >
              <div className="text-gray-700">
                <div className="grid grid-cols-1 text-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("ref code")}</div>
                    <div className="px-4 py-2">{id}</div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("username")}</div>
                    <div className="px-4 py-2">{userId}</div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div className="px-4 py-2">{email}</div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("phone")}</div>
                    <div className="px-4">
                      <PhoneInput
                        placeholder={t("phone")}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                      />
                      <p className="error-message-text">{errorPhone && t("Phone is required")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("id code")}</div>
                    <div className="px-4">
                      <input
                        className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        {...register("idCode", {
                          required: t("id code is required"),
                        })}
                        autoComplete="off"
                      />
                      <p className="error-message-text">{errors.idCode?.message}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("walletAddress")} Tier 1</div>
                    <div className="">
                      <div className="px-4 py-2 break-words">{walletAddress1}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("walletAddress")} Tier 2</div>
                    <div className="">
                      <div className="px-4 py-2 break-words">{walletAddress2}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("walletAddress")} Tier 3</div>
                    <div className="">
                      <div className="px-4 py-2 break-words">{walletAddress3}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("walletAddress")} Tier 4</div>
                    <div className="">
                      <div className="px-4 py-2 break-words">{walletAddress4}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("walletAddress")} Tier 5</div>
                    <div className="">
                      <div className="px-4 py-2 break-words">{walletAddress5}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("isRegistered")}</div>
                    <div className="px-4 py-2">
                      {countPay >= 1 ? t("finished") : t("unfinished")}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("count pay")}</div>
                    <div className="px-4 py-2">
                      {countPay === 0 ? 0 : countPay - 1} {t("times")}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Tier</div>
                    <div className="px-4 py-2">{tier}</div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="px-4 py-2 font-semibold">{t("fine")}</div>
                    <div className="px-4 py-2">{fine}</div>
                  </div>
                  {status === "UNVERIFY" ? (
                    <>
                      <div className="flex justify-center my-4">
                        <div className="max-w-2xl rounded-lg shadow-xl bg-gray-50">
                          <div className="m-4">
                            <label className="inline-block mb-2 text-gray-500">
                              {t("idCardFront")}
                            </label>
                            <div className="flex flex-col items-center justify-center w-full">
                              <UploadFile
                                register={register}
                                watch={watch}
                                required={false}
                                name="imgFront"
                              />
                              <p className="error-message-text">{errors.imgFront?.message}</p>
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
                              <UploadFile
                                register={register}
                                watch={watch}
                                required={false}
                                name="imgBack"
                              />
                              <p className="error-message-text">{errors.imgBack?.message}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="px-4 py-2 font-semibold">{t("idCardFront")}</div>
                        <img
                          src={`${
                            userInfo.imgFront.includes("cloudinary")
                              ? userInfo.imgFront
                              : import.meta.env.VITE_API_URL + "/uploads/CCCD/" + userInfo.imgFront
                          }`}
                          className="w-full px-4 py-2"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="px-4 py-2 font-semibold">{t("idCardBack")}</div>
                        <img
                          src={`${
                            userInfo.imgBack.includes("cloudinary")
                              ? userInfo.imgBack
                              : import.meta.env.VITE_API_URL + "/uploads/CCCD/" + userInfo.imgBack
                          }`}
                          className="w-full px-4 py-2"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || loadingUploadFileFront || loadingUploadFileBack}
                className="flex items-center justify-center w-full px-8 py-4 my-6 font-bold text-white transition duration-300 ease-in-out transform rounded-full shadow-lg hover:underline gradient focus:outline-none focus:shadow-outline hover:scale-105"
              >
                {loading && <Loading />}
                {t("update")}
              </button>
              {status === "APRROVED" && phone !== "" && idCode !== "" && (
                <button
                  onClick={handleChangeWallet}
                  disabled={loadingChangeWallet}
                  className="flex items-center justify-center w-full px-8 py-4 my-6 font-bold text-white transition duration-300 ease-in-out transform rounded-full shadow-lg hover:underline gradient focus:outline-none focus:shadow-outline hover:scale-105"
                >
                  {loadingChangeWallet && <Loading />}
                  {t("change wallet")}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-8 py-4 my-6 font-bold transition duration-300 ease-in-out transform border rounded-full shadow-lg hover:underline focus:outline-none focus:shadow-outline hover:scale-105"
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
