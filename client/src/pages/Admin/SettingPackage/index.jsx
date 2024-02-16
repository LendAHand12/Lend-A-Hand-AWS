import Package from "@/api/Package";
import Loading from "@/components/Loading";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Switch from "react-switch";
import { useSelector } from "react-redux";

const SettingPage = () => {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    await Package.updatePackages({ packages })
      .then((response) => {
        toast.success(t(response.data.message));
        setLoading(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(t(message));
        setLoading(false);
      });
  }, [packages]);

  useEffect(() => {
    (async () => {
      await Package.getAllPackages()
        .then((response) => {
          setPackages(response.data.packages);
          setLoading(false);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
          setLoading(false);
        });
    })();
  }, []);

  const handleChangeStatus = useCallback(
    (id) => {
      const findItemIndex = packages.findIndex((ele) => ele._id === id);
      const newStatus =
        packages[findItemIndex].status === "active" ? "inactive" : "active";
      if (findItemIndex > -1) {
        packages.splice(findItemIndex, 1, {
          ...packages[findItemIndex],
          status: newStatus,
        });
        const newPackages = [...packages];
        setPackages(newPackages);
      }
    },
    [packages]
  );

  return (
    <div className="text-gray-900 flex justify-center bg-white">
      <div className="max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1">
        <div className="w-full p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {t("settingPackage")}
            </h1>
            <div className="w-full flex-1 mt-8">
              <form
                className="mx-auto max-w-xl"
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
              >
                {packages.map((ele) => (
                  <div
                    key={ele._id}
                    className="w-full flex items-center justify-between mb-4"
                  >
                    <span>
                      {t("buyPackage")} {ele.name}{" "}
                      {t(
                        ele.name === "A"
                          ? "buyPackageA"
                          : ele.name === "B"
                          ? "buyPackageB"
                          : "buyPackageC"
                      )}
                    </span>
                    <Switch
                      checked={ele.status === "active"}
                      onChange={() => handleChangeStatus(ele._id)}
                    />
                  </div>
                ))}

                {userInfo?.permissions
                  .find((p) => p.page.pageName === "admin-setting-package")
                  ?.actions.includes("update") && (
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {loading && <Loading />}
                    {t("confirm")}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
