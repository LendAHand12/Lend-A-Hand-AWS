import Layout from "@/containers/layout";

import "./index.less";
import { useTranslation } from "react-i18next";

const TermsPage = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <section className="py-24 flex flex-col items-center bg-white text-black">
        <header className="container max-w-2xl mb-5 my-auto">
          <div className="text-3xl mt-10 font-bold">
            <h1>Terms and Conditions</h1>
          </div>
        </header>
        <div className="container max-w-2xl">
          <div className="text-lg">
            <p className="text-xl">{t("termTitle")}</p>
            <br></br>
            <p>{t("termDate")}</p>
            <br></br>
            <hr className="my-6"></hr>
            <p className="text-xl font-semibold">{t("term1")}</p>
            <br></br>
            <ul>
              <li>
                <strong>1.1</strong> {t("term11")}
              </li>
              <li>
                <strong>1.2</strong> {t("term12")}
              </li>
            </ul>
            <hr className="my-6"></hr>
            <p className="text-xl font-semibold">{t("term2")}</p>
            <br></br>
            <ul>
              <li>
                <strong>2.1</strong> {t("term21")}
                <br></br>
                <strong className="ml-4">a)</strong> {t("term21a")}
                <br></br>
                <strong className="ml-4">b)</strong> {t("term21b")}
                <br></br>
                <strong className="ml-4">c)</strong> {t("term21c")}
                <br></br>
                <strong className="ml-4">d)</strong> {t("term21d")}
              </li>
              <li>
                <strong>2.2</strong> {t("term22")}
              </li>
            </ul>
            <hr className="my-6"></hr>
            <p className="text-xl font-semibold">{t("term3")}</p>
            <br></br>
            <ul>
              <li>
                <strong>3.1</strong> {t("term31")}
                <br></br>
                <strong className="ml-4">a)</strong> {t("term31a")}
                <br></br>
                <strong className="ml-4">b)</strong> {t("term31b")}
                <br></br>
                <strong className="ml-4">c)</strong> {t("term31c")}
                <br></br>
                <strong className="ml-4">d)</strong> {t("term31d")}
              </li>
              <li>
                <strong>3.2</strong> {t("term32")}
              </li>
            </ul>
            <hr className="my-6"></hr>
            <p className="text-xl font-semibold">{t("term4")}</p>
            <br></br>
            <ul>
              <li>
                <strong>4.1</strong> {t("term41")}
              </li>
            </ul>
            <hr className="my-6"></hr>
            <p className="text-xl font-semibold">{t("term5")}</p>
            <br></br>
            <ul>
              <li>
                <strong>5.1</strong> {t("term51")}
              </li>
            </ul>
            <hr className="my-6"></hr>
            <p className="text-xl font-semibold">{t("term6")}</p>
            <br></br>
            <ul>
              <li>
                <strong>6.1</strong> {t("term61")}
              </li>
            </ul>
            <hr className="my-6"></hr>
            <p className="text-xl font-semibold">{t("term7")}</p>
            <br></br>
            <ul>
              <li>
                <strong>7.1</strong> {t("term71")}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;
