import Layout from "@/containers/layout";
import { useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";
import { useEffect, useState } from "react";
import PageSetting from "../../api/PageSetting";
import { toast } from "react-toastify";

const ContactPage = () => {
  const { t, i18n } = useTranslation();
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
    <Layout>
      <div className="bg-white py-32">
        <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
          {t("contact")}
        </h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
        </div>
        <div className="relative w-full h-96">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={
              !loading &&
              pageData &&
              pageData.length > 0 &&
              pageData.find((ele) => ele.name === "map").val_vn
            }
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            tabIndex="0"
          ></iframe>
        </div>
        <div className="max-w-screen-lg mx-auto text-black mt-10">
          <p className="mb-8 lg:mb-16 font-light text-left text-gray-500 sm:text-xl">
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  <span className="font-semibold">{t("address")}</span> :{" "}
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
                  <span className="font-semibold">{t("phone")}</span> :{" "}
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
                  <span className="font-semibold">{t("email")}</span> :
                  {!loading &&
                    pageData &&
                    pageData.length > 0 &&
                    pageData.find((ele) => ele.name === "email").val_vn}
                </a>
              </li>
            </ul>
          </p>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
