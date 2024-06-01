import { useCallback, useEffect, useState } from "react";

import Loading from "@/components/Loading";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Payment from "@/api/Payment";
import { transfer, getAccount } from "@/utils/smartContract.js";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import axios from "axios";

Modal.setAppElement("#root");

const TransactionDetail = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const history = useHistory();
  const { pathname } = useLocation();
  const transId = pathname.split("/")[3];
  if (!transId) {
    history.push("/admin/transactions");
  }
  const [trans, setTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(false);
  const [checkRefundMess, setCheckRefundMess] = useState("");
  const [loadingChangeToRefunded, setLoadingChangeToRefunded] = useState(false);
  const [loadingCheckCanRefund, setLoadingCheckCanRefund] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [loadingRefund, setLoadingRefund] = useState(false);
  const [loadingUntilRefund, setLoadingUntilRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Payment.getPaymentDetail(transId)
        .then((response) => {
          setTrans(response.data);
          setRefundAmount(response.data.amount);
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
  }, [transId, refresh]);

  const changeToRefunded = async () => {
    setLoadingChangeToRefunded(true);
    await Payment.changeToRefunded({ id: transId })
      .then((response) => {
        toast.success(t(response.data.message));
        setLoadingChangeToRefunded(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
        setLoadingChangeToRefunded(false);
      });
  };

  const checkCanRefund = useCallback(async () => {
    setLoadingCheckCanRefund(true);
    await Payment.checkCanRefund({ id: transId })
      .then((response) => {
        setCheckRefundMess(response.data.message);
        response.data.amount && setRefundAmount(response.data.amount);
        setLoadingCheckCanRefund(false);
        setRefunding(true);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        setCheckRefundMess(message);
        setLoadingCheckCanRefund(false);
      });
  }, [transId]);

  const handRefund = useCallback(
    async (type) => {
      const account = await getAccount();
      if (account) {
        type === "A" ? setLoadingRefund(true) : setLoadingUntilRefund(true);
        try {
          const refundTrans = await transfer(
            trans.address_to,
            refundAmount > 0 ? refundAmount : trans.amount
          );
          const { transactionHash } = refundTrans;
          await adminDoneRefund(
            transId,
            transactionHash,
            trans.type,
            account,
            trans.address_to
          );
        } catch (error) {
          setLoadingRefund(false);
          setLoadingUntilRefund(false);
        }
      } else {
        toast.error(t("Please login your registered wallet"));
      }
    },
    [trans, refundAmount]
  );

  const openModal = () => {
    setShowOtpModal(true);
  };

  const closeModal = () => {
    setShowOtpModal(false);
  };

  const handleSubmitOTPSerepay = useCallback(
    (type) => {
      type === "A" ? setLoadingRefund(true) : setLoadingUntilRefund(true);
      axios
        .post(
          `${
            import.meta.env.VITE_HOST_SEREPAY
          }/api/payment/sendCodeWalletTransferArray`,
          {
            wallet: userInfo.walletAddress1,
            arrayWallet: [
              {
                amount: refundAmount,
                address: trans.address_to,
                note: "REFUND",
              },
            ],
          }
        )
        .then(() => {
          setLoadingRefund(false);
          setLoadingUntilRefund(false);
          openModal();
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
          setLoadingRefund(false);
          setLoadingUntilRefund(false);
        });
    },
    [trans, refundAmount]
  );

  const handlePaySerepay = useCallback(
    (values) => {
      const { otp } = values;
      setLoadingPayment(true);
      axios
        .post(
          `${
            import.meta.env.VITE_HOST_SEREPAY
          }/api/payment/confirmWalletTransferArray`,
          {
            code: otp,
            wallet: userInfo[`walletAddress${userInfo.tier}`],
            arrayWallet: [
              {
                amount: refundAmount,
                address: trans.address_to,
                note: "REFUND",
              },
            ],
          }
        )
        .then(async (response) => {
          const { message, status } = response.data;
          if (status) {
            await adminDoneRefund(
              trans._id,
              "refund serepay",
              trans.type,
              trans.address_from,
              trans.address_to
            );
            closeModal();
            toast.success(t(message));
            setLoadingRefund(false);
            setLoadingUntilRefund(false);
            window.location.reload(false);
          }
          setLoadingPayment(false);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
          setLoadingPayment(false);
          setLoadingRefund(false);
          setLoadingUntilRefund(false);
        });
    },
    [trans, refundAmount]
  );

  const adminDoneRefund = async (
    transId,
    transHash,
    transType,
    fromWallet,
    receiveWallet
  ) => {
    await Payment.onAdminDoneRefund({
      transId,
      transHash,
      transType,
      fromWallet,
      receiveWallet,
    })
      .then((response) => {
        toast.success(response.data.message);
        setLoadingRefund(false);
        setLoadingUntilRefund(false);
        setRefunding(false);
        setRefresh(!refresh);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingRefund(true);
        setLoadingUntilRefund(false);
      });
  };

  return (
    <div>
      <ToastContainer />
      <Modal
        isOpen={showOtpModal}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        contentLabel="Example Modal"
      >
        <div className="mx-auto flex w-full max-w-md flex-col space-y-8">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>OTP Verification</p>
            </div>
            <div className="flex flex-row text-sm text-gray-700">
              <p>{t("We have sent a code to your email")}</p>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit(handlePaySerepay)}>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-sm gap-2">
                  <div className="w-full h-16">
                    <input
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      {...register("otp", {
                        required: t("otp is required"),
                      })}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="error-message-text">{errors.otp?.message}</div>

                <div className="flex flex-col space-y-5">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        closeModal();
                      }}
                      className="flex flex-row items-center justify-center text-center border rounded-xl outline-none py-5 bg-red-500 border-none text-white text-sm shadow-sm px-8 font-semibold"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      className="flex flex-row items-center justify-center text-center border rounded-xl outline-none py-5 gradient border-none text-white text-sm shadow-sm px-8 font-semibold"
                    >
                      {loadingPayment && <Loading />}
                      {t("confirm")}
                    </button>
                  </div>
                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>{t("Didn't recieve code?")}</p>{" "}
                    <a
                      className="flex flex-row items-center text-blue-600"
                      href="http://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("Resend")}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      {loading && (
        <div className="w-full flex justify-center">
          <Loading />
        </div>
      )}
      {!loading && trans !== null && (
        <div className="container mx-auto p-5">
          <div className="mb-3 lg:mb-6">
            <div
              onClick={() => history.goBack()}
              className="max-w-fit flex text-blue-500 gap-4 hover:underline items-center cursor-pointer"
            >
              <svg
                fill="currentColor"
                className="w-4 h-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
                enableBackground="new 0 0 52 52"
              >
                <path
                  d="M48.6,23H15.4c-0.9,0-1.3-1.1-0.7-1.7l9.6-9.6c0.6-0.6,0.6-1.5,0-2.1l-2.2-2.2c-0.6-0.6-1.5-0.6-2.1,0
	L2.5,25c-0.6,0.6-0.6,1.5,0,2.1L20,44.6c0.6,0.6,1.5,0.6,2.1,0l2.1-2.1c0.6-0.6,0.6-1.5,0-2.1l-9.6-9.6C14,30.1,14.4,29,15.3,29
	h33.2c0.8,0,1.5-0.6,1.5-1.4v-3C50,23.8,49.4,23,48.6,23z"
                />
              </svg>
              {t("transactionsList")}
            </div>
          </div>
          <div className="md:flex no-wrap md:-mx-2 ">
            <div className="w-full lg:w-3/12 lg:mx-2 mb-4 lg:mb-0">
              <div className="bg-white shadow-md p-3 border-t-4 border-primary">
                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>{t("status")}</span>
                    <span className="ml-auto">
                      <span className="bg-green-600 py-1 px-2 rounded text-white text-sm">
                        {t(trans.status)}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t("transType")}</span>
                    <span className="ml-auto">
                      <span
                        className={`${
                          trans.type === "DIRECTHOLD" ||
                          trans.type === "REFERRALHOLD"
                            ? "bg-yellow-600"
                            : "bg-green-600"
                        } py-1 px-2 rounded text-white text-sm`}
                      >
                        {trans.type === "DIRECTHOLD"
                          ? t("DIRECTHOLDt")
                          : trans.type === "REFERRALHOLD"
                          ? t("REFERRALHOLDt")
                          : t(trans.type)}
                      </span>
                    </span>
                  </li>
                  {trans.type.includes("HOLD") && (
                    <li className="flex items-center py-3">
                      <span>{t("refundStatus")}</span>
                      <span className="ml-auto">
                        <span
                          className={`${
                            trans.isHoldRefund ? "bg-green-600" : "bg-red-500"
                          } py-1 px-2 rounded text-white text-sm`}
                        >
                          {trans.isHoldRefund
                            ? t("refunded")
                            : t("not refunded")}
                        </span>
                      </span>
                    </li>
                  )}
                  <li className="flex items-center py-3">
                    <span>{t("createTime")}</span>
                    <span className="ml-auto">
                      {new Date(trans.createdAt).toLocaleDateString("vi")}
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
                        {t("Send User Name")}
                      </div>
                      <div className="px-4 py-2">{trans.userId}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("Send User Email")}
                      </div>
                      <div className="px-4 py-2">{trans.email}</div>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("Send User Wallet")}
                      </div>
                      <div className="px-4 py-2">{trans.address_from}</div>
                    </div>
                    {trans.type !== "REGISTER" && (
                      <>
                        <div className="grid lg:grid-cols-2 grid-cols-1">
                          <div className="px-4 py-2 font-semibold">
                            {t("Receive User Name")}
                          </div>
                          <div className="px-4 py-2">{trans.userReceiveId}</div>
                        </div>
                        <div className="grid lg:grid-cols-2 grid-cols-1">
                          <div className="px-4 py-2 font-semibold">
                            {t("Receive User Email")}
                          </div>
                          <div className="px-4 py-2">
                            {trans.userReceiveEmail}
                          </div>
                        </div>
                        <div className="grid lg:grid-cols-2 grid-cols-1">
                          <div className="px-4 py-2 font-semibold">
                            {t("Receive User Wallet")}
                          </div>
                          <div className="px-4 py-2">{trans.address_to}</div>
                        </div>
                      </>
                    )}
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">
                        {t("amount")}
                      </div>
                      <div className="px-4 py-2">{trans.amount} USDT</div>
                    </div>
                    {trans.type !== "REGISTER" && (
                      <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="px-4 py-2 font-semibold">
                          {t("count pay")}
                        </div>
                        <div className="px-4 py-2">
                          {t("times")} {trans.userCountPay}
                        </div>
                      </div>
                    )}

                    <div className="grid lg:grid-cols-2 grid-cols-1">
                      <div className="px-4 py-2 font-semibold">Hash</div>
                      <div className="px-4 py-2">
                        <a
                          href={`https://bscscan.com/tx/${trans.hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="break-words text-blue-500"
                        >
                          {trans.hash}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {userInfo?.permissions
                  .find((p) => p.page.pageName === "admin-transactions-details")
                  ?.actions.includes("refund") &&
                  !trans.isHoldRefund &&
                  trans.type.includes("HOLD") && (
                    <button
                      onClick={changeToRefunded}
                      className="w-xl flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    >
                      {loadingChangeToRefunded && <Loading />}
                      {t("changeToRefunded")}
                    </button>
                  )}
                {!trans.isHoldRefund &&
                  trans.type.includes("HOLD") &&
                  checkRefundMess !== "" && <p>{checkRefundMess}</p>}
                {userInfo?.permissions
                  .find((p) => p.page.pageName === "admin-transactions-details")
                  ?.actions.includes("refund") &&
                  !trans.isHoldRefund &&
                  trans.type.includes("HOLD") &&
                  trans.userReceiveId !== "Unknow" &&
                  trans.userReceiveEmail !== "Unknow" && (
                    <button
                      onClick={checkCanRefund}
                      className="w-xl bg-yellow-500 text-white flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    >
                      {loadingCheckCanRefund && <Loading />}
                      {t("checkCanRefund")}
                    </button>
                  )}
                {refunding && (
                  <button
                    // onClick={() => handRefund("A")}
                    onClick={() => handleSubmitOTPSerepay("A")}
                    className="w-xl flex bg-green-600 text-white justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {loadingRefund && <Loading />}
                    {t("refund")}
                  </button>
                )}
                {userInfo?.permissions
                  .find((p) => p.page.pageName === "admin-transactions-details")
                  ?.actions.includes("refund") && (
                  <button
                    // onClick={() => handRefund("B")}
                    onClick={() => handleSubmitOTPSerepay("B")}
                    className="w-xl bg-red-600 text-white flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {loadingUntilRefund && <Loading />}
                    {t("untilRefunds")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;
