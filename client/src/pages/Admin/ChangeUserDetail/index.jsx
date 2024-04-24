import { useEffect, useState } from "react";

import ChangeUser from "@/api/ChangeUser";
import changeUserStatus from "@/constants/changeUserStatus";
import FsLightbox from "fslightbox-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import "react-phone-number-input/style.css";
import { ToastContainer, toast } from "react-toastify";
import Loading from "@/components/Loading";
import "./index.css";

const ChangeUserDetail = (match) => {
  const { id } = match.match.params;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [data, setData] = useState({});
  const [toggler, setToggler] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleToggler = () => setToggler(!toggler);

  useEffect(() => {
    (async () => {
      await ChangeUser.getDetail(id)
        .then((response) => {
          setLoading(false);
          setData(response.data.changeUser);
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

  const handleReject = () => {
    confirmAlert({
      closeOnClickOutside: false,
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <form
              onSubmit={handleSubmit((values) => onReject(onClose, values))}
              autoComplete="off"
              className="bg-gray-50 p-6 md:mx-auto"
            >
              <div className="text-center">
                <p className="text-gray-600 text-xl my-4">
                  {t("inputNoAcceptReason")}
                </p>
              </div>
              <div>
                <textarea
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  rows="4"
                  placeholder={`${t("reason")}`}
                  {...register("rejectReason", {
                    required: t("reason is required"),
                  })}
                />
                <p className="error-message-text">
                  {errors.rejectReason?.message}
                </p>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {t("confirm")}
              </button>
            </form>
          </div>
        );
      },
    });
  };

  const onReject = async (onClose, values) => {
    await ChangeUser.reject({
      changeUserId: id,
      reasonReject: values.rejectReason,
    })
      .then((response) => {
        toast.success(t(response.data.message));
        onClose();
        setRefresh(!refresh);
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

  const onApprove = async () => {
    setLoadingApprove(true);
    await ChangeUser.approve({
      changeUserId: id,
    })
      .then((response) => {
        toast.success(t(response.data.message));
        setRefresh(!refresh);
        setLoadingApprove(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingApprove(false);
      });
  };

  return (
    <div>
      <ToastContainer />
      {!loading && (
        <div className="container mx-auto p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            <div className="w-full lg:w-3/12 lg:mx-2 mb-4 lg:mb-0">
              <div className="bg-white shadow-md p-3 border-t-4 border-primary">
                <ul className=" text-gray-600 py-2 px-3 mt-3 divide-y rounded">
                  <li className="flex items-center py-3">
                    <span>{t("status")}</span>
                    <span className="ml-auto">
                      <span
                        className={`${
                          changeUserStatus.find(
                            (item) => item.status === data.status
                          ).color
                        }  py-1 px-2 rounded text-white text-sm`}
                      >
                        {t(
                          changeUserStatus.find(
                            (item) => item.status === data.status
                          ).label
                        )}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("requestTime")}</span>
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
                        {t("requestUser")}
                      </div>
                      <div className="px-4 py-2">{data.oldUserName}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("new user name")}
                      </div>
                      <div className="px-4 py-2">{data.newUserId}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("new email")}
                      </div>
                      <div className="px-4 py-2">{data.newEmail}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("new phone")}
                      </div>
                      <div className="px-4 py-2">{data.newPhone}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("new id code")}
                      </div>
                      <div className="px-4 py-2">{data.newIdCode}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("new wallet address")}
                      </div>
                      <div className="px-4 py-2 break-words">
                        {data.newWalletAddress}
                      </div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("reason")}
                      </div>
                      <div className="px-4 py-2 break-words">
                        {data.reasonRequest}
                      </div>
                    </div>
                    <>
                      <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="px-4 py-2 font-semibold">
                          {t("idCardFront")}
                        </div>
                        <img
                          onClick={handleToggler}
                          src={data.newImgFront}
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
                          src={data.newImgBack}
                          className="w-full px-4 py-2"
                        />
                      </div>
                    </>
                  </div>
                </div>
                {data.status === "PENDING" && (
                  <>
                    <button
                      onClick={onApprove}
                      className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    >
                      {loadingApprove ? <Loading /> : t("accept")}
                    </button>
                    <div
                      onClick={handleReject}
                      className="w-full flex justify-center items-center cursor-pointer hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out bg-red-500 text-white"
                    >
                      {t("notAccept")}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeUserDetail;
