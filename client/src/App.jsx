import { lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ErrorPage from "@/pages/ErrorPage";
import PublicRoute from "@/helpers/PublicRoute";
import AppLayout from "./containers/AppLayout";
import PrivateRoute from "@/helpers/PrivateRoute";

const HomePage = lazy(() => import("@/pages/HomePage"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ConfirmPage = lazy(() => import("@/pages/ConfirmPage"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const TermsPage = lazy(() => import("@/pages/Terms"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const MemberPage = lazy(() => import("@/pages/MemberPage"));

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute path="/" component={HomePage} exact />
        <PublicRoute path="/login" component={Login} exact />
        <PublicRoute path="/terms" component={TermsPage} exact />
        <PublicRoute path="/register" component={Register} exact />
        <PublicRoute path="/confirm" component={ConfirmPage} exact />
        <PublicRoute path="/forgot-password" component={ForgotPassword} exact />
        <PublicRoute path="/reset-password" component={ResetPassword} exact />
        <PublicRoute path="/about" component={AboutPage} exact />
        <PublicRoute path="/member" component={MemberPage} exact />

        <PrivateRoute path="/user" component={AppLayout} />
        <PrivateRoute path="/admin" component={AppLayout} />

        <Route component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;
