import { useEffect, useState } from "react";

import userStatus from "@/constants/userStatus";
import { useTranslation } from "react-i18next";
import User from "@/api/User";
import { ToastContainer, toast } from "react-toastify";
import NoContent from "@/components/NoContent";
import Loading from "@/components/Loading";
import { useHistory } from "react-router-dom";

const Users = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchStatus, setSearchStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await User.getAllUsers(pageNumber, keyword, searchStatus)
        .then((response) => {
          const { users, pages } = response.data;
          setData(users);
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
  }, [pageNumber, refresh]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setPageNumber(1);
      await User.getAllUsers(1, keyword, searchStatus)
        .then((response) => {
          const { users, pages } = response.data;
          setData(users);
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
  }, [searchStatus, keyword]);

  const onChangeStatus = (e) => setSearchStatus(e.target.value);

  const onSearch = (e) => {
    setTimeout(() => {
      setKeyword(e.target.value);
    }, 1000);
  };

  const handleApprove = async (id) => {
    await User.changeStatus({ id, status: "APPROVED" })
      .then((response) => {
        const { message } = response.data;
        setRefresh(!refresh);
        toast.success(t(message));
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
      });
  };

  const handleDetail = (id) => {
    history.push(`/admin/users/${id}`);
  };

  const handleTree = (id) => {
    console.log({ id });
  };

  const handleBlock = async (id) => {
    await User.changeStatus({ id, status: "LOCKED" })
      .then((response) => {
        const { message } = response.data;
        setRefresh(!refresh);
        toast.success(message);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
      });
  };

  const handleNextPage = () => {
    setPageNumber((pageNumber) => pageNumber + 1);
  };

  const handlePrevPage = () => {
    setPageNumber((pageNumber) => pageNumber - 1);
  };

  return (
    <div>
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10">
        <div className="flex items-center justify-between pb-4 bg-white">
          <div>
            <select
              className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none active:outline-none"
              onChange={onChangeStatus}
              defaultValue={"all"}
            >
              <option value="all">All</option>
              {userStatus.map((status) => (
                <option value={status.status} key={status.status}>
                  {t(status.status)}
                </option>
              ))}
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
            <input
              type="text"
              onChange={onSearch}
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50"
              placeholder={t("search with user name or email")}
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
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                {t("status")}
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              !loading &&
              data.map((ele) => (
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
                      <div className="font-normal text-gray-500">{ele._id}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{ele.email}</td>
                  <td className="px-6 py-4">
                    <div
                      className={`max-w-fit text-white rounded-sm py-1 px-2 text-sm ${
                        userStatus.find((item) => item.status === ele.status)
                          .color
                      } mr-2`}
                    >
                      {t(ele.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-6">
                      {ele.status === "PENDING" && (
                        <button
                          onClick={() => handleApprove(ele._id)}
                          className="font-medium text-gray-500 hover:text-primary"
                        >
                          <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            id="check"
                            data-name="Flat Line"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-auto"
                          >
                            <polyline
                              id="primary"
                              points="5 12 10 17 19 8"
                              style={{
                                fill: "none",
                                stroke: "currentColor",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                              }}
                            ></polyline>
                          </svg>
                        </button>
                      )}
                      {ele.status !== "UNVERIFY" && (
                        <button
                          onClick={() => handleDetail(ele._id)}
                          className="font-medium text-gray-500 hover:text-primary"
                        >
                          <svg
                            fill="currentColor"
                            className="w-6 h-auto"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" />
                          </svg>
                        </button>
                      )}

                      {ele.status === "APPROVED" && (
                        <button className="font-medium text-gray-500 hover:text-primary">
                          <svg
                            className="w-6 h-auto"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="48"
                              height="48"
                              fill="white"
                              fillOpacity="0.01"
                            />
                            <path
                              d="M13.0448 14C13.5501 8.3935 18.262 4 24 4C29.738 4 34.4499 8.3935 34.9552 14H35C39.9706 14 44 18.0294 44 23C44 27.9706 39.9706 32 35 32H13C8.02944 32 4 27.9706 4 23C4 18.0294 8.02944 14 13 14H13.0448Z"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M24 28L29 23"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M24 25L18 19"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M24 44V18"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => handleBlock(ele._id)}
                        className="font-medium text-gray-500 hover:text-primary"
                      >
                        <svg
                          fill="currentColor"
                          viewBox="-3.5 0 19 19"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-auto"
                        >
                          <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
                        </svg>
                      </button>
                    </div>
                  </td>
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
            <ul className="inline-flex items-center -space-x-px">
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
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Users;
