import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Posts from "@/api/Posts";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const LegalDetails = ({ match }) => {
  const id = match.params?.id ? match.params.id : "";
  const category = match.params?.category ? match.params.category : "";
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState({});
  const [html, setHtml] = useState("<div>Loading</div>");

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Posts.getPostsById(id)
        .then((response) => {
          setNews(response.data);
          setHtml(
            i18n.language === "vi"
              ? response.data.text_vn
              : response.data.text_en
          );
          setLoading(false);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
          setLoading(false);
        });
    })();
  }, []);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-wrap w-full mb-8">
          <div className="w-full flex justify-between items-center">
            <div className="w-full mb-6 lg:mb-0">
              <h1 className="sm:text-4xl text-5xl font-medium title-font mb-2 text-gray-900">
                {t(category === "COMMON" ? "legalCommon" : "legalTier")}
              </h1>
              <div className="h-1 w-20 gradient rounded"></div>
            </div>
            <button
              onClick={() => history.push("/terms")}
              className="px-8 py-4 w-40 text-center flex text-xs justify-center items-center hover:underline gradient text-white font-bold rounded-full shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              {t("back")}
            </button>
          </div>
          <div className="mt-10">
            <h3 className="font-semibold text-lg text-left mb-4 max-w-2xl">
              {i18n.language === "vi" && news.title_vn}
              {i18n.language === "en" && news.title_en}
            </h3>
            <div className="my-2 italic">
              <div>
                {new Date(news.createdAt).toLocaleTimeString("vi")} -{" "}
                {new Date(news.createdAt).toLocaleDateString("vi")}
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-3 mb-64 max-w-screen overflow-hidden">
              {news.type === "text" && (
                <div dangerouslySetInnerHTML={{ __html: html }} />
              )}
              {news.type === "file" && (
                <div className="mt-3">
                  <label className="block text-sm text-gray-700 dark:text-gray-400">
                    <span>{t("Tải File")} : </span>
                    <div className="mt-2">
                      <a
                        className="font-normal underline text-blue-500"
                        download
                        rel="noopener noreferrer"
                        target="_blank"
                        href={`${import.meta.env.VITE_API_URL}/uploads/posts/${
                          i18n.language === "vi"
                            ? news.filename_vn
                            : news.filename_en
                        }`}
                      >
                        {i18n.language === "vi"
                          ? news.filename_vn
                          : news.filename_en}
                      </a>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalDetails;
