import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageSetting from "@/api/PageSetting";
import { toast } from "react-toastify";

const Serepay = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    (async () => {
      await PageSetting.getAllPageSetting()
        .then((response) => {
          setPageData(response.data.settings);
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
    <div className="px-4">
      <div className="p-4 mb-4 text-blue-800 rounded-lg bg-blue-50">
        {!loading &&
          pageData &&
          pageData.length > 0 &&
          pageData.find((ele) => ele.name === "serepay").val_vn}
      </div>
      <a
        href={`${import.meta.env.VITE_HOST_SEREPAY_LOGIN}`}
        target="_blank"
        className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        rel="noreferrer"
      >
        {t("login")} Serepay
      </a>
    </div>
  );
};

export default Serepay;
