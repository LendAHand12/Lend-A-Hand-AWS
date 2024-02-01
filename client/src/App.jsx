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
const OurTeamPage = lazy(() => import("@/pages/OurTeamPage"));
const NewsPage = lazy(() => import("@/pages/News"));
const NewsDetailPage = lazy(() => import("@/pages/News/Detail"));
const TermsDetailPage = lazy(() => import("@/pages/Terms/Detail"));
const ContactPage = lazy(() => import("@/pages/Contact"));

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute path="/" component={HomePage} exact />
        <PublicRoute path="/login" component={Login} exact />
        <PublicRoute path="/register" component={Register} exact />
        <PublicRoute path="/confirm" component={ConfirmPage} exact />
        <PublicRoute path="/forgot-password" component={ForgotPassword} exact />
        <PublicRoute path="/reset-password" component={ResetPassword} exact />
        <PublicRoute path="/aboutUs" component={AboutPage} exact />
        <PublicRoute path="/ourTeam" component={OurTeamPage} exact />
        <PublicRoute path="/news" component={NewsPage} exact />
        <PublicRoute path="/news/:id" component={NewsDetailPage} />
        <PublicRoute path="/terms" component={TermsPage} exact />
        <PublicRoute path="/terms/:id" component={TermsDetailPage} />
        <PublicRoute path="/contact" component={ContactPage} exact />

        <PrivateRoute path="/user" component={AppLayout} />
        <PrivateRoute path="/admin" component={AppLayout} />

        <Route component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;
