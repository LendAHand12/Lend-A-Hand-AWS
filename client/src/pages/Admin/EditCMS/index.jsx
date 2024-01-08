import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "../../../api/Page";
import { toast } from "react-toastify";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import TextEditor from "../../../components/TextEditor";

const EditCMSPage = ({ match }) => {
  const pageName = match.params?.page ? match.params.page : "";
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await Page.getPageDetailByPageName(pageName)
        .then((response) => {
          console.log({ data: response.data });
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

  return (
    <>
      <div className="">
        <div>
          <h1 className="text-2xl font-bold">CMS - {t(pageName)}</h1>
        </div>
        <div>
          <div className="mb-3">
            <span className="mb-2 block text-lg text-gray-700">
              Nội dung tiếng Việt
            </span>
            <TextEditor
              editor={ClassicEditor}
              data={""}
              onChangeHandle={(event, editor) => {
                const data = editor.getData();
                console.log({ data });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCMSPage;
