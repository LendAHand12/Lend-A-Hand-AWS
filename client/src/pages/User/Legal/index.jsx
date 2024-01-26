import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cmsCategory from "@/constants/cmsCategory";

const Legal = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {cmsCategory
          .filter((ele) => ele.type === "legal")
          .map((ele) => (
            <Link
              key={ele.category}
              to={`/user/legal/${ele.category}`}
              className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full  py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              {t(ele.title)}
            </Link>
          ))}
      </div>
    </>
  );
};

export default Legal;
