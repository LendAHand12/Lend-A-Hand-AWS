import User from "@/api/User";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { exportToExcel } from "@/utils/export";
import "./index.less";

const ExportPaymentPage = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const exportUsers = async () => {
    setLoading(true);
    await User.getAllUsersForExport()
      .then((response) => {
        const excelData = convertResponseDataToExportData(response.data, {
          [t("order")]: null,
          [t("name")]: null,
          [t("phone")]: null,
          [t("email")]: null,
          [t("walletAddress")]: null,
          [t("memberSince")]: null,
          [t("refUserName")]: null,
          [t("count pay")]: null,
          [t("countChild")]: null,
          [t("fine")]: null,
          [t("status")]: null,
        });
        exportToExcel(
          excelData,
          `${t("usersListFileName")}_${moment().format("DD/MM/YYYY_HH:mm:ss")}`
        );
        setLoading(false);
        toast.success(t("export successful"));
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

  // const exportTrans = async () => {
  //   setLoading(true);
  //   await Payment.getAllTransForExport()
  //     .then((response) => {
  //       const excelData = convertResponseDataToExportData(response.data, {
  //         [t("order")]: null,
  //         [t("senderName")]: null,
  //         [t("senderEmail")]: null,
  //         [t("address_from")]: null,
  //         [t("receiverName")]: null,
  //         [t("receiverEmail")]: null,
  //         [t("address_ref")]: null,
  //         [t("type")]: null,
  //         [t("amount")]: null,
  //         [t("tier")]: null,
  //         [t("isHoldRefund")]: null,
  //         [t("status")]: null,
  //       });
  //       exportToExcel(
  //         excelData,
  //         `${t("transListFileName")}_${moment().format("DD/MM/YYYY_HH:mm:ss")}`
  //       );
  //       setLoading(false);
  //       toast.success(t("export successful"));
  //     })
  //     .catch((error) => {
  //       let message =
  //         error.response && error.response.data.message
  //           ? error.response.data.message
  //           : error.message;
  //       toast.error(t(message));
  //       setLoading(false);
  //     });
  // };

  const convertResponseDataToExportData = (responseData, nullObj) => {
    return responseData.map((item, i) => {
      item.order = i + 1;
      return Object.assign(
        { ...nullObj },
        Object.fromEntries(
          Object.entries(item).map(([key, value]) => [
            t(`${key}`),
            key === "type" &&
            (value === "REFERRALHOLD" || value === "DIRECTHOLD")
              ? t(`${value}t`)
              : key === "status" || key === "type" || key === "isHoldRefund"
              ? t(value)
              : value,
          ])
        )
      );
    });
  };

  //   File 1: danh sách user

  // Tên, email, địa chỉ ví, Ngày tham gia, Người giới thiệu, Số lần thanh toán, Tiền phạt, Trạng thái tài khoản

  // File 2: danh sách giao dịch

  // Người gửi, Địa chỉ ví gửi, Người nhận, Địa chỉ ví nhận, Loại giao dịch (đăng ký. HHTT, LAH...), Số tiền, Đã hoàn trả hay chưa,
  // Thời gian giao dịch

  return (
    <>
      <ToastContainer />
      <div>
        {loading && (
          <div
            className="flex items-center gradient text-white text-sm px-4 py-3 mb-4"
            role="alert"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
            </svg>
            <p>{t("Getting data")}...</p>
          </div>
        )}
        <button
          onClick={exportUsers}
          className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          {t("export users list")}
        </button>
        {/* <button
          onClick={exportTrans}
          className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          {t("export trans list")}
        </button> */}
      </div>
    </>
  );
};

export default ExportPaymentPage;
