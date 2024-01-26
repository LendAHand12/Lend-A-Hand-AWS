import { useCallback, useEffect, useState } from "react";

import Permissions from "@/api/Permissions";
import Page from "@/api/Page";
import Loading from "@/components/Loading";
import NoContent from "@/components/NoContent";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const PermissionsDetailPage = ({ match }) => {
  const { id } = match.params;
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [pages, setPages] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [pagePers, setPagePers] = useState([]);
  const [role, setRole] = useState("");
  const [showErrorRole, setShowErrorRole] = useState(false);

  useEffect(() => {
    (async () => {
      if (id !== "create") {
        setLoading(true);
        await Permissions.getPermissionById(id)
          .then((response) => {
            const { permission } = response.data;
            setData(permission);
            setRole(permission.role);
            setPagePers(permission.pagePermissions);
            setLoading(false);
          })
          .catch((error) => {
            let message =
              error.response && error.response.data.error
                ? error.response.data.error
                : error.message;
            toast.error(t(message));
            setLoading(false);
          });
      }
    })();

    (async () => {
      setLoading(true);
      await Page.getAllPages()
        .then((response) => {
          const { pages } = response.data;
          setPages(pages);
          setLoading(false);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.error
              ? error.response.data.error
              : error.message;
          toast.error(t(message));
          setLoading(false);
        });
    })();
  }, []);

  const handleChangeAction = useCallback(
    (pageId, action) => {
      const newPagePers = [...pagePers];

      const pageIndex = newPagePers.findIndex(
        (ele) => ele.page?._id === pageId
      );

      if (pageIndex > -1) {
        const changingPage = newPagePers[pageIndex];
        if (changingPage.actions.includes(action)) {
          const updatedActions = changingPage.actions.filter(
            (ele) => ele != action
          );
          changingPage.actions = updatedActions;
        } else {
          changingPage.actions.push(action);
        }
        newPagePers.splice(pageIndex, 1, changingPage);
        setPagePers(newPagePers);
      } else {
        newPagePers.push({ page: { _id: pageId }, actions: [action] });
        setPagePers(newPagePers);
      }
    },
    [pagePers]
  );

  const handleSubmit = useCallback(async () => {
    if (!role || role === "") {
      setShowErrorRole(true);
      return;
    }
    setLoadingUpdate(true);
    const body = {
      role,
      pagePermissions: pagePers,
    };
    await Permissions.updatePermission(id, body)
      .then((response) => {
        toast.success(t(response.data.message));
        setLoadingUpdate(false);
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
        setLoadingUpdate(false);
      });
  }, [pagePers, data, role]);

  return (
    <div>
      <ToastContainer />
      <div className="container">
        <div className="mb-10">
          <div className="flex gap-4">
            <div className="font-bold text-2xl mt-2">Role - </div>
            <div>
              <input
                type="text"
                defaultValue={role}
                onChange={(e) => {
                  setShowErrorRole(false);
                  setRole(e.target.value);
                }}
                className="p-2 rounded-md border border-gray-500 font-bold text-2xl"
              />
              {showErrorRole && (
                <p className="error-message-text">{t("roleRequire")}</p>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {!loading & (pages.length > 0) &&
            pages.map((page) => (
              <div key={page._id}>
                <p className="font-semibold mb-4">{t(page.pageName)}</p>
                {page.actions.map((action) => (
                  <button
                    className={`w-full flex items-center border px-4 py-2 mb-2 rounded-md focus:ring-blue-500 ${
                      pagePers
                        .find((ele) => ele.page?._id === page._id)
                        ?.actions.includes(action)
                        ? "border-blue-500"
                        : ""
                    }`}
                    onClick={() => handleChangeAction(page._id, action)}
                    key={action}
                  >
                    {t(action)}
                  </button>
                ))}
              </div>
            ))}
        </div>
        <div>
          <button
            onClick={handleSubmit}
            disabled={loadingUpdate}
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {loadingUpdate && <Loading />}
            {t("update")}
          </button>
          <button
            onClick={() => history.push("/admin/permissions")}
            className="w-full flex justify-center items-center hover:underline border font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsDetailPage;
