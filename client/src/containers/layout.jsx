import Footer from "@/components/Footer";
import Nav from "@/components/Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="leading-normal tracking-normal text-white gradient">
        <Nav />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
