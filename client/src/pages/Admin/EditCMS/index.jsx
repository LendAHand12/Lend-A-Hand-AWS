import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "../../../api/Page";
import { toast } from "react-toastify";
import TextEditor from "../../../components/TextEditor";
import { useForm } from "react-hook-form";
import UploadMultiImage from "../../../components/UploadMultiImage";
import Loading from "@/components/Loading";

const EditCMSPage = ({ match }) => {
  const pageName = match.params?.page ? match.params.page : "";
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [files, setFile] = useState([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    (async () => {
      await Page.getPageDetailByPageName(pageName)
        .then((response) => {
          console.log({ data: response.data });
          setPageData(response.data.page);
          setFile(response.data.page.images);
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

  return (
    <>
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
    </>
  );
};

export default EditCMSPage;
