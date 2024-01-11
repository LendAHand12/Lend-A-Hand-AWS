import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "../../../api/Page";
import { toast } from "react-toastify";
import TextEditor from "../../../components/TextEditor";
import { useForm } from "react-hook-form";
import UploadMultiImage from "../../../components/UploadMultiImage";

const EditCMSPage = ({ match }) => {
  const pageName = match.params?.page ? match.params.page : "";
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [files, setFile] = useState([]);

  const {
    register,
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
    async (values) => {
      values.images = files;
      await Page.updatePage(pageName, values)
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
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div>
          <h1 className="text-2xl font-bold">CMS - {t(pageName)}</h1>
        </div>
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
              data={pageData?.content_vn}
              onChangeHandle={(event, editor) => {
                const data = editor.getData();
                console.log({ dataVn: data });
                setValue("content_vn", data);
              }}
            />
          </div>
          <div className="mb-10">
            <span className="mb-2 block text-lg font-semibold text-gray-900">
              Nội dung tiếng Anh :
            </span>
            <TextEditor
              data={pageData?.content_en}
              onChangeHandle={(event, editor) => {
                const data = editor.getData();
                console.log({ dataEn: data });
                setValue("content_en", data);
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
      </form>
    </>
  );
};

export default EditCMSPage;
