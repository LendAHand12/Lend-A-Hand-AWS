import { useCallback, useEffect, useState } from "react";

import userStatus from "@/constants/userStatus";
import { useTranslation } from "react-i18next";
import User from "@/api/User";
import { ToastContainer, toast } from "react-toastify";
import NoContent from "@/components/NoContent";
import Loading from "@/components/Loading";
import { useHistory } from "react-router-dom";

const Trash = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      await User.getAllDeletedUsers(pageNumber, searchKey)
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
      await User.getAllDeletedUsers(1, searchKey)
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
  }, [searchKey]);

  const onSearch = (e) => {
    setKeyword(e.target.value);
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
    history.push(`/admin/tree/${id}`);
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

  const handleSearch = useCallback(() => {
    setSearchKey(keyword);
  }, [keyword]);

  return (
    <div>
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10">
        <div className="flex items-center justify-between pb-4 bg-white">
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
                placeholder={t("search with user name or email")}
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
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Mã giới thiệu cũ
              </th>
              <th scope="col" className="px-6 py-3">
                Thời gian xoá
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
                      <div className="text-base font-semibold">{ele.email}</div>
                      <div className="font-normal text-gray-500">{ele._id}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{ele.oldId}</td>
                  <td className="px-6 py-4">{ele.createdAt}</td>
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

export default Trash;
