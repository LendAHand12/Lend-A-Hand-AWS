import { useEffect, useState } from "react";

import User from "@/api/User";
import Loading from "@/components/Loading";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import NoContent from "@/components/NoContent";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const RemoveLastUserTierPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [currentTier, setCurrentTier] = useState(2);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await User.getLastUserInTier({ tier: currentTier })
        .then((response) => {
          console.log({ data: response.data });
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.error
              ? error.response.data.error
              : error.message;
          toast.error(t(message));
          setLoading(false);
        });
    })();
  }, [refresh, currentTier]);

  const handleRemove = async (userId, tier) => {
    confirmAlert({
      closeOnClickOutside: true,
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto mb-40">
              <div className="relative p-4 text-center bg-gray-100 rounded-lg shadow-lg sm:p-5">
                <button
                  onClick={onClose}
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
                  {t("Are you remove tree this.")}
                </p>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={onClose}
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 "
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={() => handleDeleteTree(userId, tier, onClose)}
                    className="flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 "
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      },
    });
  };

  const handleDeleteTree = async (userId, tier, onClose) => {
    console.log({ userId, tier });
    await User.removeLastUserInTier({ userId, tier })
      .then((response) => {
        toast.error(t(response.data.message));
        setRefresh(!refresh);
        onClose();
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
      <div className="flex items-center gap-4">
        {[2, 3, 4, 5].map((item) => (
          <button
            key={item}
            onClick={() => setCurrentTier(item)}
            className={`flex justify-center items-center hover:underline gradient text-white font-bold ${
              currentTier === item ? "border-2 border-gray-700" : ""
            } rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out`}
          >
            {t("tier")} {item}
          </button>
        ))}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10">
        <h1 className="text-xl font-semibold mb-10">
          {t("systemNewInTier")} {currentTier}
        </h1>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Tier
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading && data && (
              <tr
                className="bg-white border-b hover:bg-gray-50"
                key={data.tier}
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
                >
                  <div className="">
                    <div className="text-base font-semibold">
                      {data.userName}
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">{data.userId}</td>
                <td className="px-6 py-4">{data.tier}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-6">
                    <button
                      onClick={() => handleRemove(data.userId, data.tier)}
                      className="font-medium text-gray-500 hover:text-primary"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-auto"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && (
          <div className="w-full flex justify-center my-4">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveLastUserTierPage;
