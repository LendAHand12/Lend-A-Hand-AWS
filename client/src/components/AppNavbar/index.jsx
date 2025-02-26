import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAccount, useConnect } from "wagmi";
import { bsc } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import LOGO from "@/assets/img/logo-horizon.png";
import { ToastContainer, toast } from "react-toastify";
import AdminRoutes from "@/routes/admin";
import UserRoutes from "@/routes/user";
import { shortenWalletAddress } from "@/utils";

const AppNav = () => {
  var routes = [];
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef();
  const auth = useSelector((state) => state.auth);
  const { permissions } = auth.userInfo;
  if (auth.userInfo.role !== "user") {
    routes = AdminRoutes.filter((route) => {
      let currentRoute = `/admin${route.path}`;
      let page = permissions.find((ele) => ele.page?.path === currentRoute);
      if (page && page.actions.includes("read")) {
        return route;
      }
    });
  } else {
    routes = UserRoutes.filter((route) => {
      if (route.permissionWithStatus.includes(auth.userInfo.status)) {
        if (auth.userInfo.phone === "" || auth.userInfo.idCode === "") {
          if (route.noNeedCheckInfo) {
            return route;
          }
        } else {
          return route;
        }
      }
    });
  }
  const { address, isConnected } = useAccount();
  const connector = new MetaMaskConnector({
    chains: [bsc],
  });
  const { connect } = useConnect({
    connector,
  });

  const onClickOutside = () => setShowMenu(false);

  // useEffect(() => {
  //   connect();
  // }, []);

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
  }, [pathname]);

  const connectWallet = () => {
    if (!connector.ready) {
      toast.error(t("Please install metamask"));
    } else {
      connect();
    }
  };

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
          <div className="block xl:hidden pr-4">
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
            className={`w-full flex-grow xl:flex xl:items-center xl:w-auto ${
              showMenu ? "" : "hidden"
            } mt-2 lg:mt-0 bg-inherit xl:bg-transparent text-black p-4 lg:p-0 z-20`}
          >
            <ul className="list-reset xl:flex justify-end flex-1 items-center">
              {routes
                .filter((route) => !!route.title)
                .map((route) => (
                  <li className="mr-3 group relative" key={route.path}>
                    <Link
                      className={`inline-block py-2 px-4 text-black ${
                        pathname.includes(route.path) ? "font-bold" : ""
                      } no-underline`}
                      to={`${
                        auth.userInfo.role !== "user" ? "/admin" : "/user"
                      }${route.path}`}
                    >
                      {t(route.title)}
                      {route.children && route.children.length > 0 && (
                        <ul className="lg:absolute lg:p-2 lg:top-10 lg:w-56 lg:invisible lg:group-hover:visible lg:bg-gray-100 lg:rounded-md lg:shadow-lg flex flex-col">
                          {route.children
                            .filter((ele) => ele.title)
                            .map((childRoute) => (
                              <li key={childRoute.path}>
                                <Link
                                  className={`group1 inline-block font-normal py-2 px-4 hover:text-gray-700 hover:text-underline`}
                                  to={`${
                                    auth.userInfo.role !== "user"
                                      ? "/admin"
                                      : "/user"
                                  }${childRoute.path}`}
                                >
                                  {t(childRoute.title)}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      )}
                    </Link>
                  </li>
                ))}

              {auth.accessToken &&
                (auth.userInfo.status === "APPROVED" ||
                  auth.userInfo.status === "LOCKED") &&
                (isConnected ? (
                  <>
                    <button className="flex items-center gap-2 hover:underline bg-white text-gray-800 font-bold rounded-full lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                      <svg
                        className="w-6 h-auto"
                        viewBox="0 0 16 16"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#444"
                          d="M14.5 4h-12.12c-0.057 0.012-0.123 0.018-0.19 0.018-0.552 0-1-0.448-1-1 0-0.006 0-0.013 0-0.019l12.81-0.499v-1.19c0.005-0.041 0.008-0.089 0.008-0.138 0-0.652-0.528-1.18-1.18-1.18-0.049 0-0.097 0.003-0.144 0.009l-11.374 1.849c-0.771 0.289-1.31 1.020-1.31 1.877 0 0.011 0 0.023 0 0.034l-0 10.728c-0 0.003-0 0.006-0 0.010 0 0.828 0.672 1.5 1.5 1.5 0 0 0 0 0 0h13c0 0 0 0 0 0 0.828 0 1.5-0.672 1.5-1.5 0-0.004-0-0.007-0-0.011v-8.999c0-0.012 0.001-0.027 0.001-0.041 0-0.801-0.649-1.45-1.45-1.45-0.018 0-0.036 0-0.053 0.001zM13 11c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5c0.828 0 1.5 0.672 1.5 1.5s-0.672 1.5-1.5 1.5z"
                        ></path>
                      </svg>
                      {shortenWalletAddress(address, 8)}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={connectWallet}
                      className="flex items-center gap-2 hover:underline bg-white text-gray-800 font-bold rounded-full lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                    >
                      <svg
                        className="w-6 h-auto"
                        viewBox="0 0 16 16"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#444"
                          d="M14.5 4h-12.12c-0.057 0.012-0.123 0.018-0.19 0.018-0.552 0-1-0.448-1-1 0-0.006 0-0.013 0-0.019l12.81-0.499v-1.19c0.005-0.041 0.008-0.089 0.008-0.138 0-0.652-0.528-1.18-1.18-1.18-0.049 0-0.097 0.003-0.144 0.009l-11.374 1.849c-0.771 0.289-1.31 1.020-1.31 1.877 0 0.011 0 0.023 0 0.034l-0 10.728c-0 0.003-0 0.006-0 0.010 0 0.828 0.672 1.5 1.5 1.5 0 0 0 0 0 0h13c0 0 0 0 0 0 0.828 0 1.5-0.672 1.5-1.5 0-0.004-0-0.007-0-0.011v-8.999c0-0.012 0.001-0.027 0.001-0.041 0-0.801-0.649-1.45-1.45-1.45-0.018 0-0.036 0-0.053 0.001zM13 11c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5c0.828 0 1.5 0.672 1.5 1.5s-0.672 1.5-1.5 1.5z"
                        ></path>
                      </svg>
                      Connect
                    </button>
                  </>
                ))}
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

export default AppNav;
