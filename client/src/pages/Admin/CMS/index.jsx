import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Page from "../../../api/Page";
import { toast } from "react-toastify";

const CMSPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [listPages, setListPages] = useState([]);

  useEffect(() => {
    (async () => {
      await Page.getAllPages()
        .then((response) => {
          console.log({ data: response.data });
          setListPages(response.data.pages);
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {listPages.map((page) => (
          <Link
            key={page.pageName}
            to={page.pathEdit}
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t(page.pageName)}
          </Link>
        ))}
      </div>
    </>
  );
};

export default CMSPage;
