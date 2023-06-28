import { useCallback, useEffect, useState } from "react";

import Loading from "@/components/Loading";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Payment from "@/api/Payment";
import { transfer, getAccount } from "@/utils/smartContract.js";

const TransactionDetail = () => {
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Payment.getPaymentDetail(transId)
        .then((response) => {
          setTrans(response.data);
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

  const handRefund = useCallback(async () => {
    const account = await getAccount();
    if (account) {
      setLoadingRefund(true);
      try {
        const refundTrans = await transfer(trans.address_to, trans.amount);
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
      }
    } else {
      toast.error(t("Please login your registered wallet"));
    }
  }, [trans]);

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
        setRefunding(false);
        setRefresh(!refresh);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingRefund(false);
      });
  };

  return (
    <div>
      <ToastContainer />
      {loading && (
        <div className="w-full flex justify-center">
          <Loading />
        </div>
      )}
      {!loading && trans !== null && (
        <div className="container mx-auto p-5">
          <div className="mb-3 lg:mb-6">
            <Link
              to="/admin/transactions"
              className="max-w-fit flex text-blue-500 gap-4 hover:underline items-center"
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
              Transactions
            </Link>
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
                {!trans.isHoldRefund && trans.type.includes("HOLD") && (
                  <button
                    onClick={changeToRefunded}
                    className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {loadingChangeToRefunded && <Loading />}
                    {t("changeToRefunded")}
                  </button>
                )}
                {!trans.isHoldRefund &&
                  trans.type.includes("HOLD") &&
                  checkRefundMess !== "" && <p>{checkRefundMess}</p>}
                {!trans.isHoldRefund && trans.type.includes("HOLD") && (
                  <button
                    onClick={checkCanRefund}
                    className="w-full flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {loadingCheckCanRefund && <Loading />}
                    {t("checkCanRefund")}
                  </button>
                )}
                {refunding && (
                  <button
                    onClick={handRefund}
                    className="w-full flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {loadingRefund && <Loading />}
                    {t("refund")}
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
