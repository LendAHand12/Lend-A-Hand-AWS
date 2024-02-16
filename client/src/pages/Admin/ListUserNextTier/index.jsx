import { useCallback, useEffect, useState } from "react";

import User from "@/api/User";
import Loading from "@/components/Loading";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { PaginationControl } from "react-bootstrap-pagination-control";
import NoContent from "@/components/NoContent";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector } from "react-redux";

const ListUserNextTierPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentChooseTier, setCurrentChooseTier] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [childLength, setChildLenght] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await User.getListNextUserTier()
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
  }, [refresh]);

  const handleChangeNextUser = async (tier) => {
    setCurrentChooseTier(tier);
  };

  const getUserWithTier = useCallback(
    (tier, pageNumber, searchKey, childLength) => {
      (async () => {
        setLoading(true);
        await User.getUsersWithTier({
          tier,
          pageNumber,
          searchKey,
          childLength,
        })
          .then((response) => {
            const { users, pages } = response.data;
            setUsers(users);
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
    },
    []
  );

  useEffect(() => {
    if (currentChooseTier !== 0) {
      getUserWithTier(currentChooseTier, pageNumber, searchKey, childLength);
    }
  }, [currentChooseTier, pageNumber, searchKey, childLength]);

  const handleChangePage = (page) => {
    setPageNumber(page);
  };

  const handleSearch = useCallback(() => {
    setSearchKey(keyword);
  }, [keyword]);

  const onSearch = (e) => {
    setKeyword(e.target.value);
  };

  const handleChange = useCallback(
    (userId) => {
      (async () => {
        confirmAlert({
          title: t("Are you sure to change this."),
          message: "",
          buttons: [
            {
              label: "Yes",
              onClick: async () => {
                await User.changeNextUserTier({
                  userId,
                  tier: currentChooseTier,
                })
                  .then((response) => {
                    const { message } = response.data;
                    setRefresh(!refresh);
                    setCurrentChooseTier(0);
                    setChildLenght(0);
                    toast.success(t(message));
                  })
                  .catch((error) => {
                    let message =
                      error.response && error.response.data.error
                        ? error.response.data.error
                        : error.message;
                    toast.error(t(message));
                  });
              },
            },
            {
              label: "No",
            },
          ],
        });
      })();
    },
    [currentChooseTier]
  );

  const onChangeChildLength = (e) => setChildLenght(e.target.value);

  return (
    <div>
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10">
        <h1 className="text-xl font-semibold mb-10">
          {t("listUserReceiveNextTier")}
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
            {data.length > 0 &&
              !loading &&
              data.map((ele) => (
                <tr
                  className="bg-white border-b hover:bg-gray-50"
                  key={ele.tier}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
                  >
                    <div className="">
                      <div className="text-base font-semibold">
                        {ele.userName}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{ele.userId}</td>
                  <td className="px-6 py-4">{ele.tier}</td>
                  <td className="px-6 py-4">
                    {userInfo?.permissions
                      .find((p) => p.page.pageName === "admin-list-tier")
                      ?.actions.includes("update") && (
                      <div className="flex gap-6">
                        <button
                          onClick={() => handleChangeNextUser(ele.tier)}
                          className="font-medium text-gray-500 hover:text-primary"
                        >
                          <svg
                            fill="currentColor"
                            viewBox="0 0 52 52"
                            className="w-6 h-auto"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="m27.3 37.6c-3-1.2-3.5-2.3-3.5-3.5 0-1.2 0.8-2.3 1.8-3.2 1.8-1.5 2.6-3.9 2.6-6.4 0-4.7-2.9-8.5-8.3-8.5s-8.3 3.8-8.3 8.5c0 2.5 0.8 4.9 2.6 6.4 1 0.9 1.8 2 1.8 3.2 0 1.2-0.5 2.3-3.5 3.5-4.4 1.8-8.6 3.8-8.7 7.6 0.2 2.6 2.2 4.8 4.7 4.8h23c2.5 0 4.5-2.2 4.5-4.7-0.1-3.8-4.3-5.9-8.7-7.7z m17.2-18.6c0-7.4-6.1-13.5-13.5-13.5v-3.5l-6.8 5.5c-0.3 0.3-0.2 0.8 0.1 1.1l6.7 5.4v-3.5c4.7 0 8.5 3.8 8.5 8.5h-3.5l5.5 6.8c0.3 0.3 0.8 0.3 1.1 0l5.4-6.8h-3.5z"></path>
                          </svg>
                        </button>
                      </div>
                    )}
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
      </div>
      {currentChooseTier !== 0 && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10 mt-10">
          <h1 className="text-xl font-semibold mb-10">
            {t("chooseNextUserForTier")} {currentChooseTier}
          </h1>
          <div className="flex items-center justify-between pb-4 bg-white">
            <div className="flex items-center gap-4">
              <p>{t("countChild")} :</p>
              <select
                className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none active:outline-none"
                onChange={onChangeChildLength}
                value={childLength}
                disabled={loading}
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
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
                  placeholder={t("search with user name or email")}
                  value={keyword}
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
                  Tier
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 &&
                !loading &&
                users.map((ele) => (
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
                          {ele.userName}
                        </div>
                        <div className="font-normal text-gray-500">
                          {ele._id}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{ele.tier}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-6">
                        <button
                          onClick={() => handleChange(ele.userId)}
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
                <span className="font-semibold text-gray-900">
                  {pageNumber}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">{totalPage}</span>{" "}
                page
              </span>
              <div>
                <PaginationControl
                  page={pageNumber}
                  between={5}
                  total={20 * totalPage}
                  limit={20}
                  changePage={handleChangePage}
                  ellipsis={1}
                />
              </div>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default ListUserNextTierPage;
