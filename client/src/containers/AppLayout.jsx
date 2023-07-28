import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import AppFooter from "@/components/AppFooter";
import FallbackLoading from "@/components/FallbackLoading";
import AdminRoutes from "@/routes/admin";
import UserRoutes from "@/routes/user";
import ErrorPage from "@/pages/ErrorPage";
import AppNav from "@/components/AppNavbar";
import User from "@/api/User";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { UPDATE_USER_INFO, LOGOUT } from "@/slices/authSlice";

const AppLayout = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  var routes = [];
  if (!userInfo) {
    history.push("/login");
  } else {
    if (userInfo.isAdmin) {
      routes = AdminRoutes;
    } else {
      routes = UserRoutes.filter((route) => {
        if (route.permissionWithStatus.includes(userInfo.status)) {
          if (userInfo.phone === "" || userInfo.idCode === "") {
            if (route.noNeedCheckInfo) {
              return route;
            }
          } else {
            return route;
          }
        }
      });
    }
  }

  useEffect(() => {
    (async () => {
      await User.getProfile()
        .then((response) => {
          dispatch(UPDATE_USER_INFO(response.data));
        })
        .catch(() => {
          toast.error(t("Token expired"));
          dispatch(LOGOUT());
        });
    })();
  }, []);

  return (
    <>
      <div className="leading-normal tracking-normal">
        <AppNav />
        <div className="container mx-auto py-32 min-h-screen bg-white">
          <Suspense fallback={<FallbackLoading />}>
            <Switch>
              {routes.map((route, i) => {
                return route.component ? (
                  <Route
                    key={i}
                    exact={true}
                    path={`${userInfo.isAdmin ? "/admin" : "/user"}${
                      route.path
                    }`}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}

              <Redirect exact from="/user" to="/user/profile" />
              <Redirect exact from="/admin" to="/admin/dashboard" />
              <Route component={ErrorPage} />
            </Switch>
          </Suspense>
        </div>
        <AppFooter />
      </div>
    </>
  );
};

export default AppLayout;
