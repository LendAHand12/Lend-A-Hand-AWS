import { Link } from "react-router-dom";
import LOGO from "@/assets/img/logo-vertical.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
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
                  {t(
                    "29 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP Hồ Chí Minh, Việt Nam"
                  )}
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  <strong>{t("phone")}</strong> : (+84-28) 2250.8166
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  <strong>{t("email")}</strong> : support@lah12.com
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-1 mr-10">
            <p className="uppercase text-gray-500 md:mb-6">Legal</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="/terms"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  Terms
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-1 mr-10">
            <p className="uppercase text-gray-500 md:mb-6">Social</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  Facebook
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  Linkedin
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <a
                  href="#"
                  className="no-underline hover:underline text-gray-800 hover:text-primary"
                >
                  Twitter
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
