import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Loading from "@/components/Loading";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import Select from "react-select";
import User from "@/api/User";

const ReferralPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  const [childId, setChildId] = useState("");
  const [listChild, setListChild] = useState([]);
  const defaultRef = `${import.meta.env.VITE_URL}/register?ref=${userInfo.id}`;
  const [link, setLink] = useState(defaultRef);

  useEffect(() => {
    if (childId === "") {
      setLink(defaultRef);
    } else {
      setLink(`${defaultRef}&receiveId=${childId}`);
    }
  }, [childId, defaultRef]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await User.getListChild()
        .then((response) => {
          const newData = response.data.map((ele) => ({
            value: ele.id,
            label: ele.userId,
          }));
          setListChild([{ value: "", label: t("No choose") }, ...newData]);
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

  const onCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success(t("copied"));
  };

  return (
    <>
      <ToastContainer />
      <div
        className="w-full mx-auto rounded-lg bg-white shadow-xl p-5 text-gray-700 mt-4"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-10">
          <h1 className="text-center font-bold text-xl uppercase">
            {t("Create referral link")}
          </h1>
        </div>
        {loading ? (
          <div className="w-full flex justify-center">
            <Loading />
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="font-bold text-sm mb-2 ml-1">
                {t("Choose children")}
              </label>
              <div>
                {/* <select
                  onChange={(e) => {
                    setChildId(e.target.value);
                  }}
                  value={childId}
                  className="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="">{t("No choose")}</option>
                  {listChild.length > 0 &&
                    listChild.map((ele) => (
                      <option key={ele.id} value={ele.id}>
                        {ele.userId}
                      </option>
                    ))}
                </select> */}
                <Select
                  options={listChild}
                  onChange={(e) => {
                    setChildId(e.value);
                  }}
                  className="mt-4 border-gray-200 rounded-md border-2"
                  // value={childId}
                ></Select>
              </div>
            </div>

            <div className="mb-3 flex gap-4">
              <input
                className="flex-1 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                type="text"
                value={link}
                readOnly
              />
              <button
                onClick={onCopy}
                className="flex text-xs justify-center items-center hover:underline gradient text-white font-bold rounded-full py-1 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                Copy
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReferralPage;
