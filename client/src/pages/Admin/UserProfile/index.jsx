import { useCallback, useEffect, useState } from "react";

import User from "@/api/User";
import FsLightbox from "fslightbox-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import Loading from "@/components/Loading";
import PhoneInput from "react-phone-number-input";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-phone-number-input/style.css";
import "./index.css";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";
import axios from "axios";
import { useSelector } from "react-redux";

const UserProfile = (match) => {
  const { id } = match.match.params;
  const { userInfo } = useSelector((state) => state.auth);
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [data, setData] = useState({});
  const [toggler, setToggler] = useState(false);
  const [isEditting, setEditting] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [packageOptions, setPackageOptions] = useState([]);
  const [currentOpenLah, setCurrentOpenLah] = useState(null);
  const [currentCloseLah, setCurrentCloseLah] = useState(null);
  const [phone, setPhone] = useState("");
  const [errorPhone, setErrPhone] = useState(false);
  const [loadingUploadFileFront, setLoadingUploadFileFront] = useState(false);
  const [loadingUploadFileBack, setLoadingUploadFileBack] = useState(false);
  const [imgFront, setImgFront] = useState("");
  const [imgBack, setImgBack] = useState("");

  const handleToggler = () => setToggler(!toggler);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    (async () => {
      await User.getUserById(id)
        .then((response) => {
          setLoading(false);
          setData(response.data);
          const {
            userId,
            email,
            phone,
            idCode,
            walletAddress1,
            walletAddress2,
            walletAddress3,
            walletAddress4,
            walletAddress5,
            tier,
          } = response.data;
          setValue("userId", userId);
          setValue("email", email);
          setPhone(phone);
          setValue("idCode", idCode);
          setValue("tier", tier);
          setValue("walletAddress1", walletAddress1);
          setValue("walletAddress2", walletAddress2);
          setValue("walletAddress3", walletAddress3);
          setValue("walletAddress4", walletAddress4);
          setValue("walletAddress5", walletAddress5);
          setCurrentOpenLah(response.data.openLah);
          setCurrentCloseLah(response.data.closeLah);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
        });
    })();
  }, [id, refresh]);

  const onSubmit = useCallback(
    async (values) => {
      if (phone === "") {
        setErrPhone(true);
        return;
      }
      const body = {};
      if (values.userId !== data.userId) {
        body.userId = values.userId;
      }
      if (values.note !== data.note) {
        body.note = values.note;
      }
      if (values.email !== data.email) {
        body.email = values.email;
      }
      if (data.phone !== phone) {
        body.phone = phone;
      }
      if (values.idCode !== data.idCode) {
        body.idCode = values.idCode;
      }
      if (values.tier !== data.tier) {
        body.tier = values.tier;
      }
      if (values.walletAddress1 !== data.walletAddress1) {
        body.walletAddress1 = values.walletAddress1;
      }
      if (values.walletAddress2 !== data.walletAddress2) {
        body.walletAddress2 = values.walletAddress2;
      }
      if (values.walletAddress3 !== data.walletAddress3) {
        body.walletAddress3 = values.walletAddress3;
      }
      if (values.walletAddress4 !== data.walletAddress4) {
        body.walletAddress4 = values.walletAddress4;
      }
      if (values.walletAddress5 !== data.walletAddress5) {
        body.walletAddress5 = values.walletAddress5;
      }
      if (currentOpenLah !== data.openLah) {
        body.openLah = currentOpenLah;
      }
      if (currentCloseLah !== data.closeLah) {
        body.closeLah = currentCloseLah;
      }
      if (imgFront) {
        body.imgFront = imgFront;
      }
      if (imgBack) {
        body.imgBack = imgBack;
      }
      if (values.newStatus !== data.status) {
        body.newStatus = values.newStatus;
      }
      if (values.newFine !== data.fine) {
        body.newFine = values.newFine;
      }
      if (values.hold !== data.hold) {
        body.hold = values.hold;
      }

      if (values.holdLevel !== data.holdLevel) {
        body.holdLevel = values.holdLevel;
      }

      if (Object.keys(body).length === 0) {
        setEditting(false);
        return;
      }

      setLoadingUpdate(true);
      await User.adminUpdateUser(id, body)
        .then((response) => {
          setLoadingUpdate(false);
          toast.success(t(response.data.message));
          setRefresh(!refresh);
          setEditting(false);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
          setLoadingUpdate(false);
          setEditting(false);
        });
    },
    [data, currentCloseLah, currentOpenLah, imgFront, imgBack, phone]
  );

  const handleDeleteUser = async (onClose) => {
    setLoadingDelete(true);
    onClose();
    toast.warning(t("deleting"));
    await User.deleteUserById(id)
      .then((response) => {
        const { message } = response.data;
        setLoadingDelete(false);
        toast.success(t(message));
        history.push("/admin/users");
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingDelete(false);
      });
  };

  const handleDelete = useCallback(async () => {
    confirmAlert({
      closeOnClickOutside: true,
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto mb-40">
              <div className="relative p-4 text-center bg-gray-100 rounded-lg shadow-lg sm:p-5">
                <button
                  onClick={onClose}
                  disabled={loadingDelete}
                  className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <svg
                  className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <p className="mb-4 text-gray-500">
                  {t("Are you sure to do this.")}
                </p>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={onClose}
                    disabled={loadingDelete}
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 "
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(onClose)}
                    className="flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 "
                  >
                    {loadingDelete && <Loading />}
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      },
    });
  }, [loadingDelete]);

  useEffect(() => {
    if (data.countPay === 0) {
      setPackageOptions(["A", "B", "C"]);
    } else {
      // if (data.buyPackage === "A") {
      //   setPackageOptions([]);
      // } else if (data.buyPackage === "B") {
      //   if (data.countPay === 7) {
      //     setPackageOptions(["B", "C"]);
      //   }
      // } else if (data.buyPackage === "C") {
      //   if (data.countPay === 7) {
      //     setPackageOptions(["B", "C"]);
      //   }
      // }
      setPackageOptions([data.buyPackage]);
    }
  }, [data]);

  const handleChangeOpenLah = useCallback(
    () => setCurrentOpenLah(!currentOpenLah),
    [currentOpenLah]
  );

  const handleChangeCloseLah = useCallback(
    () => setCurrentCloseLah(!currentCloseLah),
    [currentCloseLah]
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

  const handleApprove = async (id) => {
    await User.changeStatus({ id, status: "APPROVED" })
      .then((response) => {
        const { message } = response.data;
        setRefresh(!refresh);
        toast.success(t(message));
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
      });
  };

  return (
    <div>
      <ToastContainer />
      {!loading && (
        <div className="container mx-auto p-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:flex no-wrap md:-mx-2 "
          >
            <div className="w-full lg:w-3/12 lg:mx-2 mb-4 lg:mb-0">
              <div className="bg-white shadow-md p-3 border-t-4 border-primary">
                <ul className=" text-gray-600 py-2 px-3 mt-3 divide-y rounded">
                  <li className="flex items-center py-3">
                    <span>{t("status")}</span>
                    <span className="ml-auto">
                      {isEditting ? (
                        <select
                          className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none active:outline-none"
                          {...register("newStatus")}
                          defaultValue={data.status}
                          disabled={loadingUpdate}
                        >
                          <option value="APPROVED">{t("active")}</option>
                          <option value="LOCKED">{t("inactive")}</option>
                        </select>
                      ) : (
                        <span
                          className={`${
                            data.status === "UNVERIFY"
                              ? "bg-red-600"
                              : data.status === "PENDING"
                              ? "bg-yellow-600"
                              : data.status === "APPROVED"
                              ? "bg-green-600"
                              : data.status === "REJECTED"
                              ? "bg-red-600"
                              : data.status === "LOCKED"
                              ? "bg-red-600"
                              : data.status === "DELETED"
                              ? "bg-red-600"
                              : ""
                          }  py-1 px-2 rounded text-white text-sm`}
                        >
                          {t(data.status)}
                        </span>
                      )}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>Hold Tier</span>
                    <span className="ml-auto">
                      {isEditting ? (
                        <select
                          className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none active:outline-none"
                          {...register("hold")}
                          defaultValue={data.hold}
                          disabled={loadingUpdate}
                        >
                          <option value="no">{t("no")}</option>
                          <option value={1}>Tier 1</option>
                          <option value={2}>Tier 2</option>
                          <option value={3}>Tier 3</option>
                          <option value={4}>Tier 4</option>
                          <option value={5}>Tier 5</option>
                        </select>
                      ) : (
                        <span className={`py-1 px-2 text-sm`}>
                          {data.hold === "no" ? t("no") : data.hold}
                        </span>
                      )}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("holdLevel")}</span>
                    <span className="ml-auto">
                      {isEditting ? (
                        <select
                          className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none active:outline-none"
                          {...register("holdLevel")}
                          defaultValue={data.holdLevel}
                          disabled={loadingUpdate}
                        >
                          <option value="no">{t("no")}</option>
                          <option value={0}>{t("level")} 0</option>
                          <option value={1}>{t("level")} 1</option>
                          <option value={2}>{t("level")} 2</option>
                          <option value={3}>{t("level")} 3</option>
                          <option value={4}>{t("level")} 4</option>
                          <option value={5}>{t("level")} 5</option>
                          <option value={6}>{t("level")} 6</option>
                          <option value={7}>{t("level")} 7</option>
                          <option value={8}>{t("level")} 8</option>
                          <option value={9}>{t("level")} 9</option>
                          <option value={10}>{t("level")} 10</option>
                          <option value={11}>{t("level")} 11</option>
                          <option value={12}>{t("level")} 12</option>
                        </select>
                      ) : (
                        <span className={`py-1 px-2 text-sm`}>
                          {data.holdLevel === "no" ? t("no") : data.holdLevel}
                        </span>
                      )}
                    </span>
                  </li>
                  {isEditting && (
                    <>
                      <li className="flex items-center py-3">
                        <span>{t("openLah")}</span>
                        <span className="ml-auto">
                          <Switch
                            checked={currentOpenLah}
                            onChange={handleChangeOpenLah}
                          />
                        </span>
                      </li>
                      <li className="flex items-center py-3">
                        <span>{t("closeLah")}</span>
                        <span className="ml-auto">
                          <Switch
                            checked={currentCloseLah}
                            onChange={handleChangeCloseLah}
                          />
                        </span>
                      </li>
                    </>
                  )}
                  {data.status === "LOCKED" && (
                    <li className="flex items-center py-3">
                      <span>{t("lockedTime")}</span>
                      <span className="ml-auto">
                        {new Date(data.lockedTime).toLocaleDateString("vi")}
                      </span>
                    </li>
                  )}
                  {data.status === "DELETED" && (
                    <li className="flex items-center py-3">
                      <span>{t("deletedTime")}</span>
                      <span className="ml-auto">
                        {new Date(data.deletedTime).toLocaleDateString("vi")}
                      </span>
                    </li>
                  )}
                  <li className="flex items-center py-3">
                    <span>{t("memberSince")}</span>
                    <span className="ml-auto">
                      {new Date(data.createdAt).toLocaleDateString("vi")}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("tier1Time")}</span>
                    <span className="ml-auto">
                      {data.tier1Time
                        ? new Date(data.tier1Time).toLocaleDateString("vi")
                        : ""}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("tier2Time")}</span>
                    <span className="ml-auto">
                      {data.tier2Time
                        ? new Date(data.tier2Time).toLocaleDateString("vi")
                        : ""}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("tier3Time")}</span>
                    <span className="ml-auto">
                      {data.tier3Time
                        ? new Date(data.tier3Time).toLocaleDateString("vi")
                        : ""}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("tier4Time")}</span>
                    <span className="ml-auto">
                      {data.tier4Time
                        ? new Date(data.tier4Time).toLocaleDateString("vi")
                        : ""}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("tier5Time")}</span>
                    <span className="ml-auto">
                      {data.tier5Time
                        ? new Date(data.tier5Time).toLocaleDateString("vi")
                        : ""}
                    </span>
                  </li>
                  {data.changeUser && (
                    <>
                      <li className="flex items-center py-3">
                        <span>{t("old user name")}</span>
                        <span className="ml-auto">
                          {data.changeUser.oldUserName}
                        </span>
                      </li>
                      <li className="flex items-center py-3">
                        <span>{t("old email")}</span>
                        <span className="ml-auto">
                          {data.changeUser.oldEmail}
                        </span>
                      </li>
                      <li className="flex items-center py-3">
                        <span>{t("changeDate")}</span>
                        <span className="ml-auto">
                          {new Date(
                            data.changeUser.updatedAt
                          ).toLocaleDateString("vi")}
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="mt-10 bg-white shadow-md p-3 border-t-4 border-primary">
                <p className="uppercase mt-2 font-bold">{t("children")}</p>
                <div className="py-2">
                  <ul>
                    {data.listDirectUser.map((ele) => (
                      <li
                        className="bg-white border-b hover:bg-gray-50"
                        key={ele._id}
                      >
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
              <div className="mt-10 bg-white shadow-md p-3 border-t-4 border-primary">
                <p className="uppercase mt-2 font-bold">{t("refUserName")}</p>
                <div className="py-2">
                  <ul>
                    <li className="bg-white hover:bg-gray-50">
                      <div className="py-2">
                        <div className="text-base">
                          <span className="">
                            {data.refUserName}
                            <br></br>
                            <i className="text-xs">{data.refUserEmail}</i>
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-10 bg-white shadow-md p-3 border-t-4 border-primary">
                <p className="uppercase mt-2 font-bold">{t("oldParent")}</p>
                {data.listOldParent.length > 0 && (
                  <div className="py-2">
                    <ul>
                      {data.listOldParent.map((ele) => (
                        <li className="bg-white hover:bg-gray-50" key={ele._id}>
                          <div className="py-2">
                            <div className="text-base">
                              <span className="">{ele.userId}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-9/12 lg:mx-2">
              <div className="bg-white p-6 shadow-md rounded-sm border-t-4 border-primary">
                <div className="text-gray-700">
                  <div className="grid grid-cols-1 text-sm">
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("user name")}
                      </div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("userId", {
                              required: t("User ID is required"),
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.userId?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2">{data.userId}</div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">Email</div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("email", {
                              required: t("Email is required"),
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.email?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2">{data.email}</div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("phone")}
                      </div>
                      <div className="px-4 py-2">
                        {isEditting ? (
                          <>
                            <PhoneInput
                              defaultCountry="VN"
                              placeholder={t("phone")}
                              value={phone}
                              onChange={setPhone}
                            />
                            <p className="error-message-text">
                              {errorPhone && t("Phone is required")}
                            </p>
                          </>
                        ) : (
                          <PhoneInput
                            defaultCountry="VN"
                            placeholder={t("phone")}
                            value={data.phone}
                            disabled={true}
                            onChange={() => console.log("")}
                          />
                        )}
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("id code")}
                      </div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("idCode", {
                              required: t("id code is required"),
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.idCode?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2">{data.idCode}</div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("walletAddress")} Tier 1
                      </div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("walletAddress1", {
                              required: t("Wallet address is required"),
                              pattern: {
                                value: /^0x[a-fA-F0-9]{40}$/g,
                                message: t(
                                  "Please enter the correct wallet format"
                                ),
                              },
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.walletAddress1?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2 break-words">
                          {data.walletAddress1}
                        </div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("walletAddress")} Tier 2
                      </div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("walletAddress2", {
                              pattern: {
                                value: /^0x[a-fA-F0-9]{40}$/g,
                                message: t(
                                  "Please enter the correct wallet format"
                                ),
                              },
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.walletAddress2?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2 break-words">
                          {data.walletAddress2}
                        </div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("walletAddress")} Tier 3
                      </div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("walletAddress3", {
                              pattern: {
                                value: /^0x[a-fA-F0-9]{40}$/g,
                                message: t(
                                  "Please enter the correct wallet format"
                                ),
                              },
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.walletAddress3?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2 break-words">
                          {data.walletAddress3}
                        </div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("walletAddress")} Tier 4
                      </div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("walletAddress4", {
                              pattern: {
                                value: /^0x[a-fA-F0-9]{40}$/g,
                                message: t(
                                  "Please enter the correct wallet format"
                                ),
                              },
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.walletAddress4?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2 break-words">
                          {data.walletAddress4}
                        </div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("walletAddress")} Tier 5
                      </div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("walletAddress5", {
                              pattern: {
                                value: /^0x[a-fA-F0-9]{40}$/g,
                                message: t(
                                  "Please enter the correct wallet format"
                                ),
                              },
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.walletAddress5?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2 break-words">
                          {data.walletAddress5}
                        </div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("isRegistered")}
                      </div>
                      <div className="px-4 py-2">
                        {isEditting && data.countPay === 0 && (
                          <div className="flex gap-4">
                            <input
                              type="radio"
                              {...register("isRegistered")}
                            ></input>
                            <p>Đã hoàn thành</p>
                          </div>
                        )}
                        {!isEditting || data.countPay >= 1
                          ? data.countPay >= 1
                            ? t("finished")
                            : t("unfinished")
                          : ""}
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("count pay")}
                      </div>
                      <div className="px-4 py-2">
                        {data.countPay === 0 ? 0 : data.countPay - 1}{" "}
                        {t("times")}
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">Tier</div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("tier", {
                              required: t("tier is required"),
                            })}
                            autoComplete="off"
                          />
                          <p className="error-message-text">
                            {errors.tier?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2">{data.tier}</div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("buyPackage")}
                      </div>
                      <div className="px-4 py-2">
                        {!isEditting ? (
                          data.buyPackage
                        ) : (
                          <select
                            {...register("buyPackage")}
                            defaultValue={data.buyPackage}
                            disabled={loadingUpdate}
                            className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none active:outline-none"
                          >
                            {packageOptions.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">{t("fine")}</div>
                      {isEditting ? (
                        <div className="px-4">
                          <input
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("newFine", {
                              required: "Fine is required",
                            })}
                            defaultValue={data.fine}
                          />
                        </div>
                      ) : (
                        <div className="px-4 py-2">{data.fine}</div>
                      )}
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">{t("note")}</div>
                      {isEditting ? (
                        <div className="px-4">
                          <textarea
                            className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            {...register("note")}
                            autoComplete="off"
                            rows="3"
                          />
                          <p className="error-message-text">
                            {errors.note?.message}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-2">{data.note}</div>
                      )}
                    </div>

                    {isEditting ? (
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
                            onClick={handleToggler}
                            src={data.imgFront}
                            className="w-full px-4 py-2"
                          />
                        </div>
                        <FsLightbox
                          toggler={toggler}
                          sources={[data.imgFront, data.imgBack]}
                        />
                        <div className="grid lg:grid-cols-2 grid-cols-1">
                          <div className="px-4 py-2 font-semibold">
                            {t("idCardBack")}
                          </div>
                          <img
                            onClick={handleToggler}
                            src={data.imgBack}
                            className="w-full px-4 py-2"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {userInfo?.permissions
                  .find((p) => p.page.pageName === "admin-users-details")
                  ?.actions.includes("approve") &&
                  data.status === "PENDING" && (
                    <>
                      <div
                        onClick={() => handleApprove(id)}
                        className="w-full cursor-pointer flex justify-center items-center hover:underline bg-green-600 text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                      >
                        {t("accept")}
                      </div>
                    </>
                  )}
                {isEditting && (
                  <>
                    <button
                      onClick={() => setEditting(true)}
                      disabled={loading}
                      className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    >
                      {loading && <Loading />}
                      {t("update")}
                    </button>
                    <button
                      onClick={() => setEditting(false)}
                      className="w-full flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    >
                      {t("cancel")}
                    </button>
                  </>
                )}
                {userInfo?.permissions
                  .find((p) => p.page.pageName === "admin-users-details")
                  ?.actions.includes("update") &&
                  !isEditting &&
                  data.status !== "UNVERIFY" &&
                  data.status !== "DELETED" && (
                    <button
                      onClick={() => setEditting(true)}
                      className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    >
                      {t("edit")}
                    </button>
                  )}
                {userInfo?.permissions
                  .find((p) => p.page.pageName === "admin-users-details")
                  ?.actions.includes("delete") &&
                  !isEditting &&
                  data.status !== "DELETED" && (
                    <div
                      onClick={handleDelete}
                      className="w-full flex justify-center items-center cursor-pointer hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out bg-red-500 text-white"
                    >
                      {t("delete")}
                    </div>
                  )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
