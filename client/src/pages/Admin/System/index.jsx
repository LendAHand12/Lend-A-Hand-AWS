import { useEffect, useState } from "react";

import User from "@/api/User";
import Loading from "@/components/Loading";
import NoContent from "@/components/NoContent";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SystemPage = () => {
  const { t } = useTranslation();
  const [keywordMove, setKeywordMove] = useState("");
  const [keywordReceive, setKeywordReceive] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMove, setLoadingMove] = useState(false);
  const [loadingReceive, setLoadingReceive] = useState(false);
  const [moveData, setMoveData] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
  const [movePerson, setMovePerson] = useState(null);
  const [receivePerson, setReceivePerson] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      if (keywordMove === "") {
        setMoveData([]);
      } else {
        setLoadingMove(true);
        await User.getAllUsersWithKeyword({ keyword: keywordMove })
          .then((response) => {
            const { users } = response.data;
            setMoveData(users);

            setLoadingMove(false);
          })
          .catch((error) => {
            let message =
              error.response && error.response.data.error
                ? error.response.data.error
                : error.message;
            toast.error(t(message));
            setLoadingMove(false);
          });
      }
    })();
  }, [keywordMove]);

  useEffect(() => {
    (async () => {
      if (keywordReceive === "") {
        setReceiveData([]);
      } else {
        setLoadingReceive(true);
        await User.getAllUsersWithKeyword({ keyword: keywordReceive })
          .then((response) => {
            const { users } = response.data;
            setReceiveData(users);

            setLoadingReceive(false);
          })
          .catch((error) => {
            let message =
              error.response && error.response.data.error
                ? error.response.data.error
                : error.message;
            toast.error(t(message));
            setLoadingReceive(false);
          });
      }
    })();
  }, [keywordReceive]);

  const onSearchMove = (e) => {
    setTimeout(() => {
      setKeywordMove(e.target.value);
    }, 1000);
  };

  const onSearchReceive = (e) => {
    setTimeout(() => {
      setKeywordReceive(e.target.value);
    }, 1000);
  };

  const handleChooseMove = async (user) => {
    setMovePerson(user);
  };

  const handleChooseReceive = async (user) => {
    setReceivePerson(user);
  };

  return (
    <div>
      <ToastContainer />
      <div className="w-full flex justify-center gap-10">
        <div className="shadow-md sm:rounded-lg p-10">
          <h2 className="font-bold mb-4 text-xl">{t("movePerson")}</h2>
          <div className="flex items-center justify-between pb-4 bg-white">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                onChange={onSearchMove}
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50"
                placeholder={t("search with user name or email")}
                disabled={loadingMove}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {moveData.length > 0 &&
                !loadingMove &&
                moveData.map((ele) => (
                  <tr
                    className="bg-white border-b hover:bg-gray-50"
                    key={ele._id}
                  >
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
                    >
                      <div className="">
                        <div className="text-base font-semibold">
                          {ele.userId}
                        </div>
                        <div className="font-normal text-gray-500">
                          {ele._id}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleChooseMove(ele)}
                        className="flex text-xs justify-center items-center hover:underline gradient text-white font-bold rounded-full py-1 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                      >
                        {t("choose")}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loadingMove && (
            <div className="w-full flex justify-center my-4">
              <Loading />
            </div>
          )}
          {!loadingMove && moveData.length === 0 && <NoContent />}
        </div>
        <div className="shadow-md sm:rounded-lg p-10">
          <h2 className="font-bold mb-4 text-xl">{t("receivePerson")}</h2>
          <div className="flex items-center justify-between pb-4 bg-white">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                onChange={onSearchReceive}
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50"
                placeholder={t("search with user name or email")}
                disabled={loadingReceive}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {receiveData.length > 0 &&
                !loadingReceive &&
                receiveData.map((ele) => (
                  <tr
                    className="bg-white border-b hover:bg-gray-50"
                    key={ele._id}
                  >
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
                    >
                      <div className="">
                        <div className="text-base font-semibold">
                          {ele.userId}
                        </div>
                        <div className="font-normal text-gray-500">
                          {ele._id}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleChooseReceive(ele)}
                        className="flex text-xs justify-center items-center hover:underline gradient text-white font-bold rounded-full py-1 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                      >
                        {t("choose")}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {loadingReceive && (
            <div className="w-full flex justify-center my-4">
              <Loading />
            </div>
          )}
          {!loadingReceive && receiveData.length === 0 && <NoContent />}
        </div>
      </div>
      <div className="w-full my-8 text-center">
        {movePerson && receivePerson ? (
          <p>ok</p>
        ) : (
          <p>{t("Please select move and receive ID")}</p>
        )}
      </div>
    </div>
  );
};

export default SystemPage;
