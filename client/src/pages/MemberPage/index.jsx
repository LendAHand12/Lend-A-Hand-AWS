import { useEffect } from "react";
import Layout from "@/containers/layout";

import "./index.less";
import { useLocation } from "react-router-dom";
import MemberPageContent from "../../components/MemberPageContent";

const MemberPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.split("#")[1]);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);
  return (
    <Layout>
      <MemberPageContent />
    </Layout>
  );
};

export default MemberPage;
