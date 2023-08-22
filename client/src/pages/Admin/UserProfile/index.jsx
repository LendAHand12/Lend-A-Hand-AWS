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

const UserProfile = (match) => {
  const { id } = match.match.params;
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

  const handleToggler = () => setToggler(!toggler);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    (async () => {
      await User.getUserById(id)
        .then((response) => {
          setLoading(false);
          setData(response.data);
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

  const onSubmit = async (data) => {
    setLoadingUpdate(true);
    await User.adminUpdateUser(id, data)
      .then((response) => {
        setLoadingUpdate(false);
        toast.success(t(response.data.message));
        setRefresh(!refresh);
        setEditting(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
        setLoadingUpdate(false);
        setEditting(false);
      });
  };

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
                              : ""
                          }  py-1 px-2 rounded text-white text-sm`}
                        >
                          {t(data.status)}
                        </span>
                      )}
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("memberSince")}</span>
                    <span className="ml-auto">
                      {new Date(data.createdAt).toLocaleDateString("vi")}
                    </span>
                  </li>
                </ul>
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
                      <div className="px-4 py-2">{data.userId}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">Email</div>
                      <div className="px-4 py-2">{data.email}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("phone")}
                      </div>
                      <div className="px-4 py-2">
                        <PhoneInput
                          defaultCountry="VN"
                          placeholder={t("phone")}
                          value={data.phone}
                          disabled={true}
                          onChange={() => console.log("")}
                        />
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("id code")}
                      </div>
                      <div className="px-4 py-2">{data.idCode}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("walletAddress")}
                      </div>
                      <div className="px-4 py-2 break-words">
                        {data.walletAddress}
                      </div>
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
                      <div className="px-4 py-2">{data.tier}</div>
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
                        <input
                          className="w-full px-4 py-1.5 rounded-md border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                          {...register("newFine", {
                            required: "Fine is required",
                          })}
                          defaultValue={data.fine}
                        />
                      ) : (
                        <div className="px-4 py-2">{data.fine}</div>
                      )}
                    </div>

                    {data.status === "APPROVED" &&
                      data.listDirectUser.length > 0 && (
                        <>
                          <div className="grid lg:grid-cols-2 grid-cols-1">
                            <div className="px-4 py-2 font-semibold">
                              {t("children")}
                            </div>
                            <div className="px-4 py-2">
                              <ul>
                                {data.listDirectUser.map((ele) => (
                                  <li
                                    className="bg-white border-b hover:bg-gray-50"
                                    key={ele._id}
                                  >
                                    <div className="py-2">
                                      <div className="text-base">
                                        <span className="font-semibold">
                                          {ele.userId}
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      )}

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
                  </div>
                </div>
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
                {!isEditting && data.status !== "UNVERIFY" && (
                  <button
                    onClick={() => setEditting(true)}
                    className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {t("edit")}
                  </button>
                )}
                {!isEditting && (
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
