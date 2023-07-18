import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Loading from "@/components/Loading";
import { ToastContainer, toast } from "react-toastify";
import Payment from "@/api/Payment";
import { transfer, getBalance, getAccount } from "@/utils/smartContract.js";
import { useHistory } from "react-router-dom";
import { useAccount } from "wagmi";

const PaymentPage = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loadingAddRegister, setLoadingAddRegister] = useState(false);
  const [loadingAddFine, setLoadingAddFine] = useState(false);
  const [loadingAddDirectCommission, setLoadingAddDirectCommission] =
    useState(false);
  const [loadingAddReferralCommission, setLoadingAddReferralCommission] =
    useState(false);
  const [payStep, setPayStep] = useState(0);
  const { userInfo } = useSelector((state) => state.auth);
  const [total, setTotal] = useState(0);
  const registrationFee = userInfo.countPay === 0 ? 7 : 0;
  const [weeks, setWeeks] = useState(1);
  const [yourBalance, setYourBalance] = useState(0);
  const { address, isConnected } = useAccount();
  const [canPay, setCanPay] = useState(true);

  // useEffect(() => {
  //   if (!isConnected) {
  //     toast.error(t("Please connect your wallet"));
  //     setCanPay(false);
  //   } else {
  //     if (address !== userInfo.walletAddress) {
  //       toast.error(t("Please connect your true wallet"));
  //       setCanPay(false);
  //     } else {
  //       setCanPay(true);
  //     }
  //   }
  // }, [address, isConnected]);

  const paymentRegisterFee = useCallback(async () => {
    if (paymentInfo && paymentInfo.registerFee !== 0) {
      setLoadingAddRegister(true);
      try {
        const registerTransaction = await transfer(
          import.meta.env.VITE_MAIN_WALLET_ADDRESS,
          paymentInfo.registerFee
        );
        const { transactionHash } = registerTransaction;
        await addPayment(
          paymentInfo.transIds.register,
          transactionHash,
          "REGISTER"
        );
        setPayStep(2);
        setLoadingAddRegister(false);
      } catch (error) {
        toast.error(t(error.message));
        setLoadingAddRegister(false);
      }
    }
  }, [paymentInfo]);

  const paymentFineFee = useCallback(async () => {
    if (paymentInfo && paymentInfo.transactionFine !== null) {
      setLoadingAddFine(true);
      try {
        const fineTransaction = await transfer(
          import.meta.env.VITE_MAIN_WALLET_ADDRESS,
          paymentInfo.transactionFine.amount
        );
        const { transactionHash } = fineTransaction;
        await addPayment(
          paymentInfo.transactionFine._id,
          transactionHash,
          "FINE"
        );
        setLoadingAddFine(false);
        window.location.reload(false);
      } catch (error) {
        toast.error(t(error.message));
        setLoadingAddFine(false);
      }
    }
  }, [paymentInfo]);

  const paymentDirectionCommission = useCallback(async () => {
    setLoadingAddDirectCommission(true);
    try {
      const registerTransaction = await transfer(
        paymentInfo.directCommissionWallet,
        paymentInfo.directCommissionFee
      );
      const { transactionHash } = registerTransaction;
      await addPayment(paymentInfo.transIds.direct, transactionHash, "DIRECT");
      setPayStep(3);
      setLoadingAddDirectCommission(false);
    } catch (error) {
      toast.error(t(error.message));
      setLoadingAddDirectCommission(false);
    }
  }, [paymentInfo]);

  const paymentReferralCommission = async () => {
    setLoadingAddReferralCommission(true);
    try {
      const registerTransaction = await transfer(
        paymentInfo.referralCommissionWallet,
        paymentInfo.referralCommissionFee
      );
      const { transactionHash } = registerTransaction;
      await addPayment(
        paymentInfo.transIds.referral,
        transactionHash,
        "REFERRAL"
      );
      setPayStep(4);
      setLoadingAddReferralCommission(false);
    } catch (error) {
      toast.error(t(error.message));
      setLoadingAddReferralCommission(false);
    }
  };

  const addPayment = async (id, hash) => {
    await Payment.addPayment({
      id,
      hash,
    })
      .then((response) => {
        toast.success(t(response.data.message));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDonePay = useCallback(async () => {
    await Payment.onDonePayment({
      transIds: paymentInfo.transIds,
    })
      .then((response) => {
        const { message } = response.data;
        toast.success(t(message));
        history.push("/");
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
      });
  }, [paymentInfo]);

  useEffect(() => {
    setTotal(registrationFee + weeks * 15 * Math.pow(2, userInfo.tier));
  }, [weeks, userInfo, registrationFee]);

  useEffect(() => {
    (async () => {
      const account = await getAccount();
      const balance = await getBalance(account);
      setYourBalance(balance);
    })();
  }, [payStep]);

  const onGetPaymentInfo = async () => {
    await Payment.getPaymentInfo()
      .then((response) => {
        setLoadingPaymentInfo(true);
        setPaymentInfo(response.data);
        const { step } = response.data;
        setPayStep(step);
        setLoadingPaymentInfo(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
      });
  };

  useEffect(() => {
    onGetPaymentInfo();
  }, []);

  return (
    <>
      <ToastContainer />

      <div
        className="w-full mx-auto rounded-lg bg-white shadow-xl p-5 text-gray-700 mt-4"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-10">
          <h1 className="text-center font-bold text-xl uppercase">
            {t("paymentTitle")}
          </h1>
        </div>
        {canPay && (
          <>
            {userInfo.countPay === 0 && (
              <>
                <div className="mb-3">
                  <label className="font-bold text-sm mb-2 ml-1">
                    {t("registerFee")} (USDT)
                  </label>
                  <div>
                    <input
                      className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                      type="text"
                      value={registrationFee}
                      readOnly
                    />
                  </div>
                </div>
              </>
            )}

            {/* <div className="mb-3">
          <label className="font-bold text-sm mb-2 ml-1">{t("weeks")}</label>
          <div>
            <select
              disabled={true}
              onChange={(e) => setWeeks(e.target.value)}
              value={weeks}
              className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </div>
        </div> */}
            {!loadingPaymentInfo && userInfo.countPay !== 0 && (
              <div className="mb-3">
                <p className="text-lg mb-2 ml-1">
                  <span className="font-bold">{t("the next pay count")}</span> :{" "}
                  {userInfo.countPay}
                </p>
              </div>
            )}
            <div className="mb-3">
              <p className="text-lg mb-2 ml-1">
                <span className="font-bold">Total</span> : {total} USDT
              </p>
            </div>
            <div className="mb-3">
              <p className="text-lg mb-2 ml-1">
                <span className="font-bold">{t("yourBalance")}</span> :{" "}
                {yourBalance} USDT
              </p>
            </div>
            {loadingPaymentInfo ? (
              <div className="w-full flex justify-center">
                <Loading />
              </div>
            ) : (
              <>
                {paymentInfo.transactionFine ? (
                  <>
                    <div
                      className="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 "
                      role="alert"
                    >
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 inline w-5 h-5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="sr-only">Info</span>
                      <div>
                        <span className="font-medium">{t("fineFee")}!</span>{" "}
                        {t("pleasePay")}. (2 USDT)
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        onClick={paymentFineFee}
                        className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                      >
                        {loadingAddFine && <Loading />}
                        {t("payment")}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {payStep === 1 && (
                      <>
                        <div
                          className="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 "
                          role="alert"
                        >
                          <svg
                            aria-hidden="true"
                            className="flex-shrink-0 inline w-5 h-5 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">
                              {t("registerFee")}!
                            </span>{" "}
                            {t("pleasePay")}. (7 USDT)
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            onClick={paymentRegisterFee}
                            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                          >
                            {loadingAddRegister && <Loading />}
                            {t("payment")}
                          </button>
                        </div>
                      </>
                    )}
                    {payStep === 2 && (
                      <>
                        {userInfo.countPay === 0 && (
                          <div
                            className="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 "
                            role="alert"
                          >
                            <svg
                              aria-hidden="true"
                              className="flex-shrink-0 inline w-5 h-5 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium">
                                {t("registerFee")}!
                              </span>{" "}
                              {t("Payment successful")}. (7 USDT)
                            </div>
                          </div>
                        )}
                        <div
                          className="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 "
                          role="alert"
                        >
                          <svg
                            aria-hidden="true"
                            className="flex-shrink-0 inline w-5 h-5 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">
                              {t("commissionFee")}!
                            </span>{" "}
                            {t("pleasePay")}. ({paymentInfo.directCommissionFee}{" "}
                            USDT)
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            onClick={paymentDirectionCommission}
                            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                          >
                            {loadingAddDirectCommission && <Loading />}
                            {t("payment")}
                          </button>
                        </div>
                      </>
                    )}
                    {payStep === 3 && (
                      <>
                        {userInfo.countPay === 0 && (
                          <div
                            className="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 "
                            role="alert"
                          >
                            <svg
                              aria-hidden="true"
                              className="flex-shrink-0 inline w-5 h-5 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium">
                                {t("registerFee")}!
                              </span>{" "}
                              {t("Payment successful")}. (7 USDT)
                            </div>
                          </div>
                        )}
                        <div
                          className="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 "
                          role="alert"
                        >
                          <svg
                            aria-hidden="true"
                            className="flex-shrink-0 inline w-5 h-5 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">
                              {t("commissionFee")}!
                            </span>{" "}
                            {t("Payment successful")}. (
                            {paymentInfo.directCommissionFee} USDT)
                          </div>
                        </div>
                        <div
                          className="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 "
                          role="alert"
                        >
                          <svg
                            aria-hidden="true"
                            className="flex-shrink-0 inline w-5 h-5 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">{t("lahFuns")}!</span>{" "}
                            {t("pleasePay")}. (
                            {paymentInfo.referralCommissionFee} USDT)
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            onClick={paymentReferralCommission}
                            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                          >
                            {loadingAddReferralCommission && <Loading />}
                            {t("payment")}
                          </button>
                        </div>
                      </>
                    )}
                    {payStep === 4 && (
                      <>
                        {userInfo.countPay === 0 && (
                          <div
                            className="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 "
                            role="alert"
                          >
                            <svg
                              aria-hidden="true"
                              className="flex-shrink-0 inline w-5 h-5 mr-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                              <span className="font-medium">
                                {t("registerFee")}!
                              </span>{" "}
                              {t("Payment successful")}. (7 USDT)
                            </div>
                          </div>
                        )}

                        <div
                          className="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 "
                          role="alert"
                        >
                          <svg
                            aria-hidden="true"
                            className="flex-shrink-0 inline w-5 h-5 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">
                              {t("commissionFee")}!
                            </span>{" "}
                            {t("Payment successful")}. (
                            {paymentInfo.directCommissionFee} USDT)
                          </div>
                        </div>
                        <div
                          className="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 "
                          role="alert"
                        >
                          <svg
                            aria-hidden="true"
                            className="flex-shrink-0 inline w-5 h-5 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">{t("lahFuns")}!</span>{" "}
                            {t("Payment successful")}. (
                            {paymentInfo.referralCommissionFee} USDT)
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            onClick={onDonePay}
                            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                          >
                            {t("donePayment")}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PaymentPage;
