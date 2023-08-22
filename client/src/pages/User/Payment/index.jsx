import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Loading from "@/components/Loading";
import { ToastContainer, toast } from "react-toastify";
import Payment from "@/api/Payment";
import { transfer, getBalance, getAccount } from "@/utils/smartContract.js";
import { useAccount } from "wagmi";

const PaymentPage = () => {
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
  const registrationFee = userInfo.countPay === 0 ? 7 * userInfo.tier : 0;
  const [yourBalance, setYourBalance] = useState(0);
  const { address, isConnected } = useAccount();
  const [canPay, setCanPay] = useState(true);
  const [nextPay, setNextPay] = useState();
  const [continueWithBuyPackageB, setContinueWithBuyPackageB] = useState(
    userInfo.continueWithBuyPackageB
  );

  const paymentRegisterFee = useCallback(async () => {
    if (paymentInfo && paymentInfo.registerFee !== 0) {
      setLoadingAddRegister(true);
      try {
        const registerTransaction = await transfer(
          import.meta.env.VITE_MAIN_WALLET_ADDRESS,
          paymentInfo.registerFee
        );
        if (registerTransaction) {
          const { transactionHash } = registerTransaction;
          await addPayment(
            paymentInfo.transIds.register,
            transactionHash,
            // "hash",
            "REGISTER",
            paymentInfo.transIds
          );
          setPayStep(2);
          setLoadingAddRegister(false);
        } else {
          setLoadingAddRegister(false);
          throw new Error(t("payment error"));
        }
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
        if (fineTransaction) {
          const { transactionHash } = fineTransaction;
          await addPayment(
            paymentInfo.transactionFine._id,
            transactionHash,
            // "hash",
            "FINE",
            paymentInfo.transIds
          );
          setLoadingAddFine(false);
          window.location.reload(false);
        } else {
          setLoadingAddFine(false);
          throw new Error(t("payment error"));
        }
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
      if (registerTransaction) {
        const { transactionHash } = registerTransaction;
        await addPayment(
          paymentInfo.transIds.direct,
          transactionHash,
          // "hash",
          "DIRECT",
          paymentInfo.transIds
        );
        setPayStep(3);
        setLoadingAddDirectCommission(false);
      } else {
        setLoadingAddDirectCommission(false);
        throw new Error(t("payment error"));
      }
    } catch (error) {
      toast.error(t(error.message));
      setLoadingAddDirectCommission(false);
    }
  }, [paymentInfo]);

  const paymentReferralCommission = useCallback(async () => {
    setLoadingAddReferralCommission(true);
    try {
      const referralTransaction = await transfer(
        paymentInfo.referralCommissionWallet,
        paymentInfo.referralCommissionFee
      );
      if (referralTransaction) {
        const { transactionHash } = referralTransaction;
        await addPayment(
          paymentInfo.transIds.referral,
          transactionHash,
          // "hash",
          "REFERRAL",
          paymentInfo.transIds
        );
        setPayStep(0);
        setLoadingAddReferralCommission(false);
        window.location.reload();
      } else {
        setLoadingAddReferralCommission(false);
        throw new Error(t("payment error"));
      }
    } catch (error) {
      toast.error(t(error.message));
      setLoadingAddReferralCommission(false);
    }
  }, [paymentInfo]);

  const addPayment = async (id, hash, type, transIds) => {
    await Payment.addPayment({
      id,
      hash,
      type,
      transIds,
    })
      .then((response) => {
        toast.success(t(response.data.message));
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        throw new Error(message);
      });
  };

  useEffect(() => {
    (async () => {
      const account = await getAccount();
      const balance = await getBalance(account);
      setYourBalance(balance);
    })();
  }, [payStep]);

  const onGetPaymentInfo = async (continueWithBuyPackageB) => {
    setLoadingPaymentInfo(true);
    await Payment.getPaymentInfo(continueWithBuyPackageB)
      .then((response) => {
        setPaymentInfo(response.data);
        const {
          step,
          registerFee,
          directCommissionFee,
          referralCommissionFee,
          countPay,
        } = response.data;
        setTotal(registerFee + directCommissionFee + referralCommissionFee);
        setPayStep(step);
        setNextPay(countPay);
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
    onGetPaymentInfo(continueWithBuyPackageB);
  }, [continueWithBuyPackageB]);

  useEffect(() => {
    if (isConnected && address !== userInfo.walletAddress) {
      setCanPay(false);
      toast.error(t("Please login your registered wallet"));
    }
  }, [address, isConnected]);

  const handleChangeContinueWithB = async () => {
    setContinueWithBuyPackageB(!continueWithBuyPackageB);
  };

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
        {paymentInfo &&
          userInfo.buyPackage === "B" &&
          userInfo.countPay === 7 &&
          payStep < 3 && (
            <>
              <p className="text-lg mb-2">{t("contineWithPackageB")}</p>
              <div className="w-full justify-between mb-3">
                <div className="flex gap-2 text-lg">
                  <input
                    type="radio"
                    id="continue1"
                    checked={!continueWithBuyPackageB}
                    onChange={handleChangeContinueWithB}
                  />
                  <label htmlFor="continue1">{t("no")}</label>
                </div>
                <div className="flex gap-2 text-lg">
                  <input
                    type="radio"
                    id="continue2"
                    onChange={handleChangeContinueWithB}
                    checked={continueWithBuyPackageB}
                  />
                  <label htmlFor="continue2">{t("yes")}</label>
                </div>
              </div>
              <hr className="mb-3"></hr>
            </>
          )}
        {canPay && (
          <>
            {userInfo.countPay === 0 && (
              <div className="mb-3">
                <p className="text-lg mb-2 ml-1">
                  <span className="font-bold">{t("registerFee")}</span> :{" "}
                  {registrationFee} USDT
                </p>
              </div>
            )}
            {!loadingPaymentInfo && nextPay !== 0 && (
              <div className="mb-3">
                <p className="text-lg mb-2 ml-1">
                  <span className="font-bold">{t("the next pay count")}</span> :{" "}
                  {nextPay}
                </p>
              </div>
            )}
            {(userInfo.buyPackage === "A" || userInfo.buyPackage === "B") && (
              <div className="mb-3">
                <p className="text-lg mb-2 ml-1">
                  <span className="font-bold">{t("buyPackage")}</span> :{" "}
                  {userInfo.buyPackage}{" "}
                  {userInfo.buyPackage === "A"
                    ? t("buyPackageA")
                    : t("buyPackageB")}
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
                        {t("pleasePay")}. ({paymentInfo.transactionFine.amount}{" "}
                        USDT)
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        onClick={paymentFineFee}
                        disabled={loadingAddFine}
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
                            {t("pleasePay")}. ({paymentInfo.registerFee} USDT)
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            onClick={paymentRegisterFee}
                            disabled={loadingAddRegister}
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
                              {t("Payment successful")}. (
                              {paymentInfo.registerFee} USDT)
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
                            disabled={loadingAddDirectCommission}
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
                              {t("Payment successful")}. (
                              {paymentInfo.registerFee} USDT)
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
                            disabled={loadingAddReferralCommission}
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
                              {t("Payment successful")}. (
                              {paymentInfo.registerFee} USDT)
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
                        {/* <div>
                          <button
                            type="submit"
                            onClick={onDonePay}
                            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                          >
                            {t("donePayment")}
                          </button>
                        </div> */}
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
