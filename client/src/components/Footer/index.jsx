import { Link } from "react-router-dom";
import LOGO from "@/assets/img/logo-vertical.png";
import { useTranslation } from "react-i18next";
import PageSetting from "../../api/PageSetting";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Footer = () => {
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
    <footer id="contact" className="bg-white border-t">
      <div className="container mx-auto px-8">
        <div className="w-full flex flex-col md:flex-row py-6">
          <div className="flex-1 mb-6 text-black">
            <Link
              className="text-pink-600 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
              to="/"
            >
              <img src={LOGO} alt="logo" className="lg:w-32 w-20" />
            </Link>
          </div>
          <div className="flex-1 mr-10">
            <p className="uppercase text-gray-500 md:mb-6">Contact</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  <strong>{t("address")}</strong> :{" "}
                  {!loading &&
                    pageData &&
                    pageData.length > 0 &&
                    pageData.find((ele) => ele.name === "address").val_vn}
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  <strong>{t("phone")}</strong> :{" "}
                  {!loading &&
                    pageData &&
                    pageData.length > 0 &&
                    pageData.find((ele) => ele.name === "phone").val_vn}
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  <strong>{t("email")}</strong> :{" "}
                  {!loading &&
                    pageData &&
                    pageData.length > 0 &&
                    pageData.find((ele) => ele.name === "email").val_vn}
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-1 mr-10">
            <p className="uppercase text-gray-500 md:mb-6">LAH12.com</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="/"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  {t("homepage")}
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="/about"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  {t("aboutUs")}
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="/member"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  {t("ourTeam")}
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="/terms"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  {t("legal")}
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="/news"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  {t("news")}
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-1 mr-10">
            <p className="uppercase text-gray-500 md:mb-6">Social</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href={
                    !loading &&
                    pageData &&
                    pageData.length > 0 &&
                    pageData.find((ele) => ele.name === "facebook").val_vn
                  }
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  Facebook
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href={
                    !loading &&
                    pageData &&
                    pageData.length > 0 &&
                    pageData.find((ele) => ele.name === "zalo").val_vn
                  }
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  Zalo
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href={
                    !loading &&
                    pageData &&
                    pageData.length > 0 &&
                    pageData.find((ele) => ele.name === "x").val_vn
                  }
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full text-gray-500 text-center my-4">
        © 2023 Lend a Hand. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
