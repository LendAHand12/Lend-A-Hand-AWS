import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "../../../api/Page";
import { toast } from "react-toastify";
import TextEditor from "../../../components/TextEditor";
import { useForm } from "react-hook-form";
import UploadMultiImage from "../../../components/UploadMultiImage";
import Loading from "@/components/Loading";
import axios from "axios";

const EditCMSPage = ({ match }) => {
  const pageName = match?.params?.page ? match.params.page : "";
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [files, setFile] = useState([]);
  const [loadingImg, setLoadingImg] = useState(false);

  const { handleSubmit, setValue } = useForm();

  useEffect(() => {
    (async () => {
      await Page.getPageDetailByPageName(pageName)
        .then((response) => {
          console.log({ data: response.data });
          setPageData(response.data.result);
          setFile(response.data.result.images);
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

  const onSubmit = useCallback(
    async (values, mode) => {
      values.images = files;
      await Page.updatePage(pageName, values, mode)
        .then((response) => {
          const { message } = response.data;
          toast.success(t(message));
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.error
              ? error.response.data.error
              : error.message;
          toast.error(t(message));
        });
    },
    [files]
  );

  const uploadFile = (file, index) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sdblmpca");

    setLoadingImg(true);
    axios
      .post(`${import.meta.env.VITE_CLOUDINARY_URL}/image/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        // response.data.secure_url
        setLoadingImg(false);
        onChangeInfoOurTeam(response.data.secure_url, index, "img");
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(message);
        setLoadingImg(false);
      });
  };

  const onChangeInfoOurTeam = useCallback(
    (value, index, field) => {
      const newOurTeamInfo = [...pageData.val_vn];
      const changeItem = pageData.val_vn[index];

      if (changeItem) {
        changeItem[field] = value;
        newOurTeamInfo.splice(index, 1, changeItem);
        console.log({ newOurTeamInfo });
        setPageData({ ...pageData, val_vn: newOurTeamInfo });
      }
    },
    [pageData]
  );

  const onDeleteOurTeam = useCallback(
    (index) => {
      const newOurTeamInfo = [...pageData.val_vn];
      const changeItem = pageData.val_vn[index];

      if (changeItem) {
        newOurTeamInfo.splice(index, 1);
        setPageData({ ...pageData, val_vn: newOurTeamInfo });
      }
    },
    [pageData]
  );

  const onAddMember = useCallback(() => {
    const newOurTeamInfo = [...pageData.val_vn];
    const newItem = {};
    newOurTeamInfo.push(newItem);
    console.log({ newOurTeamInfo });
    setPageData({ ...pageData, val_vn: newOurTeamInfo });
  }, [pageData]);

  const handleSubmitOurTeam = useCallback(async () => {
    await Page.updatePage(pageName, { val_vn: pageData.val_vn }, "")
      .then((response) => {
        const { message } = response.data;
        toast.success(t(message));
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
      });
  }, [pageData]);

  const onChangeFooter = useCallback(
    (value, index) => {
      const newPageData = [...pageData];
      newPageData.splice(index, 1, { ...newPageData[index], val_vn: value });
      setPageData(newPageData);
    },
    [pageData]
  );

  const handleSubmitFooter = useCallback(async () => {
    await Page.updatePage(pageName, { settings: pageData }, "")
      .then((response) => {
        const { message } = response.data;
        toast.success(t(message));
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
      });
  }, [pageData]);

  return (
    <>
      {pageName === "cms-ourTeam" ? (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t(pageName)}</h1>
          </div>
          <div>
            <div className="w-full mt-10">
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 place-items-center gap-10">
                {pageData &&
                  pageData.val_vn.length > 0 &&
                  pageData.val_vn.map((ele, index) => (
                    <div className="w-fit text-black text-center" key={index}>
                      <label className="flex flex-col w-64 h-64 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300 mx-auto justify-center items-center">
                        {ele.img ? (
                          <img
                            src={ele.img}
                            className="w-64 h-64 object-fit"
                            alt="the front of identity card"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-7">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                              {loadingImg ? "Uploading..." : "Attach a file"}
                            </p>
                          </div>
                        )}

                        <input
                          type="file"
                          onChange={(e) => {
                            e.preventDefault();
                            let file = e.target.files[0];
                            if (file && file.type.match("image.*")) {
                              uploadFile(file, index);
                            }
                          }}
                          accept="image/png, imgage/jpg, image/jpeg"
                          className="opacity-0"
                        />
                      </label>
                      <div className="mt-2">
                        <input
                          placeholder={t("name")}
                          className="uppercase text-lg border text-center p-2 rounded-md mb-2"
                          defaultValue={ele.name}
                          onChange={(e) =>
                            onChangeInfoOurTeam(e.target.value, index, "name")
                          }
                        />
                        <div className="text-gray-600">
                          <input
                            defaultValue={ele.position}
                            placeholder={t("position")}
                            className="border p-2 rounded-md mb-1 text-center"
                            onChange={(e) =>
                              onChangeInfoOurTeam(
                                e.target.value,
                                index,
                                "position"
                              )
                            }
                          />
                          <input
                            defaultValue={ele.country}
                            placeholder={t("country")}
                            className="border p-2 rounded-md text-center"
                            onChange={(e) =>
                              onChangeInfoOurTeam(
                                e.target.value,
                                index,
                                "country"
                              )
                            }
                          />
                        </div>
                        <button
                          onClick={() => onDeleteOurTeam(index)}
                          className="bg-red-500 text-white mt-4 w-full p-2 rounded-lg"
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </div>
                  ))}

                <div>
                  <button
                    onClick={onAddMember}
                    className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                  >
                    {t("add")}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmitOurTeam}
              className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              {t("update")}
            </button>
          </div>
        </div>
      ) : pageName === "cms-footer" ? (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t(pageName)}</h1>
          </div>
          <div className="w-full mt-10">
            <div className="">
              {pageData &&
                pageData.length > 0 &&
                pageData.map((ele, index) => (
                  <div key={index} className="mb-10">
                    <p className="text-lg font-semibold underline mb-2">
                      {t(ele.name)}
                    </p>
                    <div className="flex items-center gap-4">
                      {/* <span>VN :</span> */}
                      <input
                        defaultValue={ele.val_vn}
                        onChange={(e) => onChangeFooter(e.target.value, index)}
                        className="border p-2 rounded-md w-full"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <button
            onClick={handleSubmitFooter}
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("update")}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit((values) => onSubmit(values, ""))}
          className=""
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t(pageName)}</h1>
            <div className="flex items-center gap-6">
              <button
                onClick={handleSubmit((values) => onSubmit(values, "preview"))}
                className="w-64 flex justify-center items-center hover:underline font-bold rounded-full my-6 py-4 px-8 border shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {t("saveDrap")}
              </button>
              <a
                href={`/admin/cms/preview/${pageName}`}
                target="_blank"
                className="w-64 flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                rel="noreferrer"
              >
                {t("preview")}
              </a>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="mt-10">
              {pageData?.haveImage && (
                <div className="mb-10">
                  <span className="mb-2 block text-lg font-semibold text-gray-900">
                    Hình ảnh :
                  </span>
                  <div>
                    <UploadMultiImage files={files} setFile={setFile} />
                  </div>
                </div>
              )}
              <div className="mb-10">
                <span className="mb-2 block text-lg font-semibold text-gray-900">
                  Nội dung tiếng Việt :
                </span>
                <TextEditor
                  defaultValue={pageData.content_vn}
                  onChange={(content) => {
                    console.log({ dataVn: content });
                    setValue("content_vn", content);
                  }}
                />
              </div>
              <div className="mb-10">
                <span className="mb-2 block text-lg font-semibold text-gray-900">
                  Nội dung tiếng Anh :
                </span>
                <TextEditor
                  defaultValue={pageData.content_en}
                  onChange={(content) => {
                    console.log({ dataEn: content });
                    setValue("content_en", content);
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {t("update")}
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default EditCMSPage;
