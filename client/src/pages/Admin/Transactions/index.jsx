import { useCallback, useEffect, useState } from "react";

import Payment from "@/api/Payment";
import Loading from "@/components/Loading";
import NoContent from "@/components/NoContent";
import transStatus from "@/constants/transStatus";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
// import { shortenWalletAddress } from "@/utils";
import { PaginationControl } from "react-bootstrap-pagination-control";

const Transactions = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchStatus, setSearchStatus] = useState("HOLD");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Payment.getAllPayments(pageNumber, searchKey, searchStatus)
        .then((response) => {
          const { payments, pages } = response.data;
          setData(payments);
          setTotalPage(pages);
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
  }, [pageNumber]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setPageNumber(1);
      await Payment.getAllPayments(1, searchKey, searchStatus)
        .then((response) => {
          const { payments, pages } = response.data;
          setData(payments);
          setTotalPage(pages);
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
  }, [searchKey, searchStatus]);

  const onChangeStatus = (e) => setSearchStatus(e.target.value);

  const onSearch = (e) => {
    setTimeout(() => {
      setKeyword(e.target.value);
    }, 1000);
  };

  // const handleNextPage = () => {
  //   setPageNumber((pageNumber) => pageNumber + 1);
  // };

  // const handlePrevPage = () => {
  //   setPageNumber((pageNumber) => pageNumber - 1);
  // };

  const handleChangePage = (page) => {
    setPageNumber(page);
  };

  const handleRowClick = (id) => {
    history.push(`/admin/transactions/${id}`);
  };

  const handleSearch = useCallback(() => {
    setSearchKey(keyword);
  }, [keyword]);

  return (
    <div>
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10">
        <div className="flex items-center justify-between pb-4 bg-white">
          <div>
            <select
              className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none active:outline-none"
              onChange={onChangeStatus}
              defaultValue={"HOLD"}
            >
              <option value="REGISTER" key="REGISTER">
                {t("REGISTER")}{" "}
              </option>
              <option value="DIRECT" key="DIRECT">
                {t("DIRECT")}{" "}
              </option>
              <option value="REFERRAL" key="REFERRAL">
                {t("REFERRAL")}{" "}
              </option>
              <option value="FINE" key="FINE">
                {t("FINE")}{" "}
              </option>
              <option value="HOLD" key="HOLD">
                {t("HOLD")}{" "}
              </option>
            </select>
          </div>
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
            <div className="flex items-center gap-2">
              <input
                type="text"
                onChange={onSearch}
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50"
                placeholder={t("search with user ref code")}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="h-8 flex text-xs justify-center items-center hover:underline gradient text-white font-bold rounded-full py-1 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {t("search")}
              </button>
            </div>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t("send")}
              </th>
              {searchStatus !== "REGISTER" && searchStatus !== "FINE" && (
                <>
                  <th scope="col" className="px-6 py-3">
                    {t("receive")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t("count pay")}
                  </th>
                </>
              )}
              <th scope="col" className="px-6 py-3">
                {t("tier")}
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Hash
              </th> */}
              <th scope="col" className="px-6 py-3">
                {t("amount")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("type")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("time")}
              </th>
              {searchStatus === "HOLD" && (
                <th scope="col" className="px-6 py-3">
                  {t("refundStatus")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              !loading &&
              data.map((ele) => (
                <tr
                  className="bg-white border-b hover:bg-gray-50"
                  key={ele._id}
                  onClick={() => handleRowClick(ele._id)}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 text-gray-900 whitespace-nowrap "
                  >
                    <div className="">
                      <div className="text-base font-semibold">
                        {ele.userId}
                      </div>
                      <div className="font-normal text-gray-500">
                        {ele.email}
                      </div>
                    </div>
                  </th>
                  {searchStatus !== "REGISTER" && searchStatus !== "FINE" && (
                    <>
                      <td className="px-6 py-4">
                        <div className="">
                          <div className="text-base font-semibold">
                            {ele.userReceiveId}
                          </div>
                          <div className="font-normal text-gray-500">
                            {ele.userReceiveEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {ele.userCountPay} {t("times")}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">{ele.tier}</td>
                  {/* <td className="px-6 py-4 text-blue-600">
                    <a
                      href={`https://bscscan.com/tx/${ele.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {shortenWalletAddress(ele.hash)}
                    </a>
                  </td> */}

                  <td className="px-6 py-4">{ele.amount} USDT</td>
                  <td className="px-6 py-4">
                    <div
                      className={`max-w-fit text-white rounded-sm py-1 px-2 text-sm ${
                        transStatus.find((item) => item.status === ele.type)
                          .color
                      } mr-2`}
                    >
                      {t(ele.type)}
                    </div>
                  </td>
                  <td className="px-6 py-4">{ele.createdAt}</td>
                  {searchStatus === "HOLD" && (
                    <td className="px-6 py-4">
                      <div
                        className={`max-w-fit text-white rounded-sm py-1 px-2 text-sm ${
                          ele.isHoldRefund ? "bg-green-500" : "bg-red-500"
                        } mr-2`}
                      >
                        {ele.isHoldRefund ? t("refunded") : t("not refunded")}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
        {loading && (
          <div className="w-full flex justify-center my-4">
            <Loading />
          </div>
        )}
        {!loading && data.length === 0 && <NoContent />}
        {!loading && data.length > 0 && (
          <nav
            className="flex items-center justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">{pageNumber}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalPage}</span>{" "}
              page
            </span>
            {/* <ul className="inline-flex items-center -space-x-px">
              <li>
                <button
                  disabled={pageNumber === 1}
                  onClick={handlePrevPage}
                  className={`block px-3 py-2 ml-0 leading-tight text-gray-500 ${
                    pageNumber === 1 ? "bg-gray-100" : "bg-white"
                  } border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
              <li>
                <button
                  disabled={pageNumber === totalPage}
                  onClick={handleNextPage}
                  className={`block px-3 py-2 leading-tight text-gray-500 ${
                    pageNumber === totalPage ? "bg-gray-100" : "bg-white"
                  } border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
            </ul> */}
            <div>
              <div>
                <PaginationControl
                  page={pageNumber}
                  between={5}
                  total={10 * totalPage}
                  limit={10}
                  changePage={handleChangePage}
                  ellipsis={1}
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Transactions;
