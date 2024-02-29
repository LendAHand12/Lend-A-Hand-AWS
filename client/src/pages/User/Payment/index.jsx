import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Payment from "@/api/Payment";
import Loading from "@/components/Loading";
import { ToastContainer, toast } from "react-toastify";
import User from "@/api/User";
import axios from "axios";
import { shortenWalletAddress } from "@/utils";
import { useForm } from "react-hook-form";
import Modal from "react-modal";

Modal.setAppElement("#root");

const PaymentPage = () => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state) => state.auth);
  const [total, setTotal] = useState(0);
  const [continueWithBuyPackageB, setContinueWithBuyPackageB] = useState(
    userInfo.continueWithBuyPackageB
  );
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(true);
  const [loadingCheckIncrease, setLoadingCheckIncrease] = useState(false);
  const [showCanIncrease, setShowCanIncrease] = useState(null);
  const [loadingAcceptIncrease, setLoadingAcceptIncrease] = useState(null);
  const [paymentsList, setPaymentsList] = useState([]);
  const [paymentIdsList, setPaymentIdsList] = useState([]);
  const [loadingGetOtp, setLoadingGetOtp] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onGetPaymentInfo = async (continueWithBuyPackageB) => {
    setLoadingPaymentInfo(true);
    await Payment.getPaymentInfo(continueWithBuyPackageB)
      .then((response) => {
        const { payments, paymentIds } = response.data;
        console.log({ payments, paymentIds });
        const totalPayment = paymentIds.reduce(
          (accumulator, currentValue) => accumulator + currentValue.amount,
          0
        );
        setTotal(totalPayment);
        setPaymentIdsList(paymentIds);
        setPaymentsList(payments);
        setLoadingPaymentInfo(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingPaymentInfo(false);
      });
  };

  useEffect(() => {
    if (userInfo.countPay < 13) {
      onGetPaymentInfo(continueWithBuyPackageB);
    } else {
      handleCheckCanIncreaseTier();
    }
  }, [continueWithBuyPackageB]);

  const handleChangeContinueWithB = async () => {
    setContinueWithBuyPackageB(!continueWithBuyPackageB);
  };

  const handleCheckCanIncreaseTier = async () => {
    setLoadingCheckIncrease(true);
    await User.checkIncreaseTier()
      .then((response) => {
        setShowCanIncrease(response.data.canIncrease);
        setLoadingCheckIncrease(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingCheckIncrease(false);
      });
  };

  const handleAcceptIncreaseTier = async () => {
    setLoadingAcceptIncrease(true);
    await User.checkIncreaseTier({ type: "ACCEPT" })
      .then(() => {
        setLoadingAcceptIncrease(false);
        window.location.reload();
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingAcceptIncrease(false);
      });
  };

  const openModal = () => {
    setShowOtpModal(true);
  };

  const closeModal = () => {
    setShowOtpModal(false);
  };

  const handleSubmitOTPSerepay = useCallback(() => {
    setLoadingGetOtp(true);
    axios
      .post(
        `${
          import.meta.env.VITE_HOST_SEREPAY
        }/api/payment/sendCodeWalletTransferArray`,
        {
          wallet: userInfo.walletAddress,
          arrayWallet: paymentsList,
        }
      )
      .then((response) => {
        setLoadingGetOtp(false);
        console.log(response);
        openModal();
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoadingGetOtp(false);
      });
  }, [paymentsList]);

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
            wallet: userInfo.walletAddress,
            arrayWallet: paymentsList,
          }
        )
        .then(async (response) => {
          const { message, status } = response.data;
          if (status) {
            await donePayment();
            closeModal();
            toast.success(t(message));
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
        });
    },
    [paymentsList]
  );

  const donePayment = useCallback(async () => {
    await Payment.onDonePayment({
      transIds: paymentIdsList,
    })
      .then((response) => {
        toast.success(t(response.data.message));
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
      });
  }, [paymentIdsList]);

  return (
    <>
      <ToastContainer />
      {userInfo.countPay === 13 ? (
        !loadingCheckIncrease && showCanIncrease ? (
          <div>
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-5"
              role="alert"
            >
              <span className="block sm:inline">
                {t("congraTier")} {userInfo.tier + 1}{" "}
              </span>
            </div>
            <span>{t("pleaseEnterToIncreaseTier")} :</span>
            <div>
              <div>
                <button
                  onClick={handleAcceptIncreaseTier}
                  disabled={loadingAcceptIncrease}
                  className="w-xl flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                >
                  {loadingAcceptIncrease ? (
                    <Loading />
                  ) : (
                    `${t("increaseNextTier")} ${userInfo.tier + 1}`
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : !loadingCheckIncrease && !showCanIncrease ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5"
            role="alert"
          >
            <span className="block sm:inline">
              {t("noTier")} {userInfo.tier}
            </span>
          </div>
        ) : (
          <Loading />
        )
      ) : loadingPaymentInfo ? (
        <div className="w-xl flex justify-center">
          <Loading />
        </div>
      ) : (
        <>
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
                  <p>
                    {t("We have sent a code to your email")}
                    {" : "}
                    {userInfo.email}
                  </p>
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
                    <div className="error-message-text">
                      {errors.otp?.message}
                    </div>

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
          <div
            className="w-full mx-auto rounded-lg bg-white shadow-xl p-5 text-gray-700 mt-4"
            style={{ maxWidth: "600px" }}
          >
            <div className="mb-10">
              <h1 className="text-center font-bold text-xl uppercase">
                {t("paymentTitle")}
              </h1>
            </div>
            {userInfo.buyPackage === "B" && userInfo.countPay === 7 && (
              <>
                <div className="w-full flex flex-col mb-3">
                  {userInfo.packages.includes("B") && (
                    <button
                      onClick={handleChangeContinueWithB}
                      disabled={continueWithBuyPackageB}
                      className={`${
                        continueWithBuyPackageB
                          ? "border hover:shadow-md focus:outline-none focus:ring-4 focus:ring-black-300 font-bold rounded-full text-lg px-5 py-2.5 text-center mb-2"
                          : "text-white gradient hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-full text-lg px-5 py-2.5 text-center mb-2"
                      }`}
                    >
                      {t("contineWithPackageB")}{" "}
                      {continueWithBuyPackageB && t("applying")}
                    </button>
                  )}
                  {userInfo.packages.includes("C") && (
                    <button
                      onClick={handleChangeContinueWithB}
                      disabled={!continueWithBuyPackageB}
                      className={`${
                        !continueWithBuyPackageB
                          ? "border hover:shadow-md focus:outline-none focus:ring-4 focus:ring-black-300 font-bold rounded-full text-lg px-5 py-2.5 text-center mb-2"
                          : "text-white gradient hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold rounded-full text-lg px-5 py-2.5 text-center mb-2"
                      }`}
                    >
                      {t("contineWithPackageC")}{" "}
                      {!continueWithBuyPackageB && t("applying")}
                    </button>
                  )}
                </div>
                <hr className="mb-3"></hr>
              </>
            )}

            <>
              {(userInfo.buyPackage === "A" ||
                (userInfo.buyPackage === "B" && continueWithBuyPackageB)) && (
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
              {!loadingPaymentInfo &&
                paymentIdsList.map((payment) => (
                  <div
                    key={payment.id}
                    className={`flex items-center p-4 mb-4 text-sm rounded-lg ${
                      payment.type === "REGISTER"
                        ? "bg-green-50 text-green-800"
                        : payment.type === "DIRECT"
                        ? "bg-yellow-50 text-yellow-800"
                        : payment.type === "FINE"
                        ? "bg-red-50 text-red-800"
                        : "bg-blue-50 text-blue-800"
                    }`}
                    role="alert"
                  >
                    <svg
                      className="flex-shrink-0 inline w-4 h-4 me-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 2h12v2H6V2zM4 6V4h2v2H4zm0 12V6H2v12h2zm2 2v-2H4v2h2zm12 0v2H6v-2h12zm2-2v2h-2v-2h2zm0-12h2v12h-2V6zm0 0V4h-2v2h2zm-9-1h2v2h3v2h-6v2h6v6h-3v2h-2v-2H8v-2h6v-2H8V7h3V5z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="font-medium">
                        {payment.type === "REGISTER"
                          ? t("registerFee")
                          : payment.type === "DIRECT"
                          ? t("commissionFee")
                          : payment.type === "FINE"
                          ? t("fine")
                          : t("lahFuns")}
                        <span> : </span>
                        <span>{payment.amount} USDT</span>
                      </div>
                      <div className="">
                        <span className="mr-2 text-black">
                          From :{" "}
                          <span className="border rounded-md border-dashed border-gray-300 p-1">
                            {shortenWalletAddress(userInfo.walletAddress, 10)}
                          </span>
                        </span>
                        <span className="mx-2 text-black">
                          To :{" "}
                          <span className="border rounded-md border-dashed border-gray-300 p-1">
                            {shortenWalletAddress(payment.to, 10)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              <button
                type="submit"
                onClick={handleSubmitOTPSerepay}
                disabled={loadingGetOtp}
                className="w-xl flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {loadingGetOtp && <Loading />}
                {t("payment")}
              </button>
            </>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentPage;
