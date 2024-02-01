import { useCallback, useEffect, useState } from "react";

import Posts from "@/api/Posts";
import Loading from "@/components/Loading";
import NoContent from "@/components/NoContent";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import cmsCategory from "../../../constants/cmsCategory";

const PostsPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const key = searchParams.get("keyword");
  const page = searchParams.get("page");
  const [pageNumber, setPageNumber] = useState(page ? page : 1);
  const [totalPage, setTotalPage] = useState(0);
  const [keyword, setKeyword] = useState(key ? key : "");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchKey, setSearchKey] = useState(key ? key : "");

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Posts.getAllPosts(pageNumber, searchKey, "")
        .then((response) => {
          const { list, pages } = response.data;
          setData(list);
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
      await Posts.getAllPosts(pageNumber, searchKey, "")
        .then((response) => {
          const { list, pages } = response.data;
          setData(list);
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

  // const onChangeStatus = (e) => setSearchStatus(e.target.value);

  const onSearch = (e) => {
    setKeyword(e.target.value);
  };

  const handleDetail = (id) => {
    history.push(`/admin/posts/edit?id=${id}`);
  };

  const handleChangePage = (page) => {
    setPageNumber(page);
  };

  const handleSearch = useCallback(() => {
    setSearchKey(keyword);
  }, [keyword]);

  const handleCreate = () => {
    history.push("/admin/posts/create");
  };

  return (
    <div>
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10">
        <div className="flex items-center justify-between pb-4 bg-white">
          {/* <div>
            <select
              className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none active:outline-none"
              onChange={onChangeStatus}
              defaultValue={searchStatus}
              disabled={loading}
            >
              <option value="all">All</option>
              {userStatus.map((status) => (
                <option value={status.status} key={status.status}>
                  {t(status.status)}
                </option>
              ))}
            </select>
          </div>
           */}

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
                defaultValue={searchKey}
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
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-8 py-4 flex text-xs justify-center items-center hover:underline gradient text-white font-bold rounded-full shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            Tạo bài viết mới
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tên bài viết
              </th>
              <th scope="col" className="px-6 py-3">
                Loại bài viết
              </th>
              <th scope="col" className="px-6 py-3">
                Phân loại
              </th>
              <th scope="col" className="px-6 py-3">
                Ngày tạo
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
                      <div className="text-base font-semibold truncate max-w-lg">
                        {ele.title_vn}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{ele.type}</td>
                  <td className="px-6 py-4">
                    {t(
                      cmsCategory.find((item) => item.category === ele.category)
                        .title
                    )}
                  </td>
                  <td className="px-6 py-4">{ele.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-6">
                      {
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
                      }
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
    </div>
  );
};

export default PostsPage;
