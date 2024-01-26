import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Posts from "@/api/Posts";
import { toast } from "react-toastify";
import NoContent from "@/components/NoContent";

const News = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Posts.getAllPosts(pageNumber, "", "news", "")
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
  }, [pageNumber]);

  const handleNextPage = () => {
    setPageNumber((pageNumber) => pageNumber + 1);
  };

  const handlePrevPage = () => {
    setPageNumber((pageNumber) => pageNumber - 1);
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-10 mx-auto max-w-7x1">
        <div className="flex flex-wrap w-full mb-8">
          <div className="w-full mb-6 lg:mb-0">
            <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
              {t("news")}
            </h1>
            <div className="h-1 w-20 gradient rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-4">
          {data.length > 0 &&
            data.map((news, i) => (
              <a
                href={`/user/news/${news._id}`}
                key={i}
                className="relative gradient w-full p-2 mx-auto border-blue-100 rounded-lg cursor-pointer hover:bg-blue-200"
              >
                <div className="text-gray-800 text-center p-4 w-full">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col items-start">
                      <h3 className="font-semibold text-lg text-left truncate max-w-xs">
                        {i18n.language === "vi" && news.title_vn}
                        {i18n.language === "en" && news.title_en}
                      </h3>
                      <p className="text-sm italic mt-1">{t("news")}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm italic">
                        {new Date(news.createdAt).toLocaleDateString("vi")}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
        </div>
        {!loading && data.length === 0 && <NoContent />}
        {data.length > 0 && (
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
    </section>
  );
};

export default News;
