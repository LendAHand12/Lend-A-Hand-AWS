import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ component: Component, ...rest }) => {
  const { accessToken, userInfo } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (accessToken && userInfo) {
          if (userInfo && userInfo.role !== "user") {
            return <Redirect to={{ pathname: "/admin" }} />;
          } else if (userInfo && userInfo.role === "user") {
            return <Redirect to={{ pathname: "/user" }} />;
          }
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PublicRoute;
