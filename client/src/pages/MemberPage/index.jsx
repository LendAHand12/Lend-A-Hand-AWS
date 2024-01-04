import { useEffect } from "react";
import Layout from "@/containers/layout";
import HomePageContent from "@/components/HomePageContent";

import "./index.less";
import { useLocation } from "react-router-dom";

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
      <HomePageContent />
    </Layout>
  );
};

export default MemberPage;
