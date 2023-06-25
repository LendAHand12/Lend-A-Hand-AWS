import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { accessToken } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (accessToken) {
          return <Component {...props} />;
        } else {
          return <Redirect to={{ pathname: "/login" }} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
