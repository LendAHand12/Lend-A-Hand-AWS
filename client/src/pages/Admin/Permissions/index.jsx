import { useEffect, useState } from "react";

import Permissions from "@/api/Permissions";
import Loading from "@/components/Loading";
import NoContent from "@/components/NoContent";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const PermissionsPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Permissions.getAllPermissions()
        .then((response) => {
          const { permissions } = response.data;
          setData(permissions);

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

  const handleDetail = (id) => {
    history.push(`/admin/permissions/${id}`);
  };

  return (
    <div>
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">{t("permissions")}</h1>
          <button
            onClick={() => history.push("/admin/permissions/create")}
            className="px-8 py-4 flex text-xs justify-center items-center hover:underline gradient text-white font-bold rounded-full shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("addNewPermissions")}
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Role name
              </th>
              <th scope="col" className="px-6 py-3">
                {t("createdAt")}
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              !loading &&
              data.map((ele) => (
                <tr
                  className="bg-white border-b hover:bg-gray-50"
                  key={ele._id}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
                  >
                    <div className="">
                      <div className="text-base font-semibold">{ele.role}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{ele.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-6">
                      {
                        <button
                          onClick={() => handleDetail(ele._id)}
                          className="font-medium text-gray-500 hover:text-primary"
                        >
                          <svg
                            fill="currentColor"
                            className="w-6 h-auto"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" />
                          </svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && (
          <div className="w-full flex justify-center my-4">
            <Loading />
          </div>
        )}
        {!loading && data.length === 0 && <NoContent />}
      </div>
    </div>
  );
};

export default PermissionsPage;
