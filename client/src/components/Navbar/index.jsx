import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LOGO from "@/assets/img/logo-horizon.png";
import { ToastContainer } from "react-toastify";

const Nav = () => {
  const { t, i18n } = useTranslation();
  const { hash, pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef();

  const onClickOutside = () => setShowMenu(false);

  useLayoutEffect(() => {
    const handleScroll = () => {
      let y = window.scrollY;
      y > 50 ? setIsScrolled(true) : setIsScrolled(false);
    };

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const onChangeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    window.location.reload(false);
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    setShowMenu(false);
  }, [pathname, hash]);

  return (
    <>
      <ToastContainer />
      <nav
        ref={ref}
        className={`fixed w-full z-30 top-0 text-white shadow-lg ${
          isScrolled ? "backdrop-blur-xl" : "gradient"
        }`}
      >
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
          <div className="pl-4 flex items-center">
            <Link
              className="toggleColour text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
              to="/"
            >
              <img src={LOGO} className="w-auto h-12 lg:h-20" />
            </Link>
          </div>
          <div className="block lg:hidden pr-4">
            <button
              onClick={toggleMenu}
              className="flex items-center p-1 text-gray-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              {showMenu ? (
                <svg
                  className="fill-current h-8 w-8"
                  viewBox="-3.5 0 19 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
                </svg>
              ) : (
                <svg
                  className="fill-current h-6 w-6"
                  viewBox="0 -5 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    id="icons"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="ui-gambling-website-lined-icnos-casinoshunter"
                      transform="translate(-2294.000000, -159.000000)"
                      fill="#1C1C1F"
                      fillRule="nonzero"
                    >
                      <g id="1" transform="translate(1350.000000, 120.000000)">
                        <path
                          d="M974,57 C975.104569,57 976,57.8954305 976,59 C976,60.1045695 975.104569,61 974,61 L946,61 C944.895431,61 944,60.1045695 944,59 C944,57.8954305 944.895431,57 946,57 L974,57 Z M974,48 C975.104569,48 976,48.8954305 976,50 C976,51.1045695 975.104569,52 974,52 L946,52 C944.895431,52 944,51.1045695 944,50 C944,48.8954305 944.895431,48 946,48 L974,48 Z M974,39 C975.104569,39 976,39.8954305 976,41 C976,42.1045695 975.104569,43 974,43 L946,43 C944.895431,43 944,42.1045695 944,41 C944,39.8954305 944.895431,39 946,39 L974,39 Z"
                          id="menu"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              )}
            </button>
          </div>
          <div
            className={`w-full flex-grow lg:flex lg:items-center lg:w-auto ${
              showMenu ? "" : "hidden"
            } mt-2 lg:mt-0 bg-inherit lg:bg-transparent text-black p-4 lg:p-0 z-20`}
          >
            <ul className="list-reset lg:flex justify-end flex-1 items-center">
              <li className="mr-3">
                <Link
                  className={`inline-block ${
                    hash.includes("#about") ? "font-bold" : ""
                  } py-2 px-4 text-black no-underline`}
                  to="/#about"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li className="mr-3">
                <Link
                  className={`inline-block ${
                    hash.includes("#features") ? "font-bold" : ""
                  } text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4`}
                  to="/#features"
                >
                  {t("features")}
                </Link>
              </li>
              <li className="mr-3">
                <Link
                  className={`inline-block ${
                    hash.includes("#contact") ? "font-bold" : ""
                  } text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4`}
                  to="/#contact"
                >
                  {t("contact")}
                </Link>
              </li>
              {/* <li className="mr-3">
                <Link
                  className={`inline-block ${
                    pathname.includes("/login") ? "font-bold" : ""
                  } text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4`}
                  to="/login"
                >
                  Login
                </Link>
              </li> */}
              <li className="mr-3">
                <Link
                  to="/login"
                  className="block hover:underline bg-white text-gray-800 font-bold rounded-full lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                >
                  {t("login")}
                </Link>
              </li>

              <li className="">
                <select
                  className="bg-inherit px-4 py-2 focus:outline-none active:outline-none"
                  onChange={onChangeLanguage}
                  defaultValue={i18n.language.includes("vi") ? "vi" : "en"}
                >
                  <option value="en">EN</option>
                  <option value="vi">VI</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
