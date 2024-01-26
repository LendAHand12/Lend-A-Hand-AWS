import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import TextEditor from "@/components/TextEditor";
import { useForm } from "react-hook-form";
import Loading from "@/components/Loading";
import cmsCategory from "@/constants/cmsCategory";
import UploadFile from "@/components/UploadFile";
import Posts from "@/api/Posts";
import { useHistory } from "react-router-dom";

const CreatePostPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: { type: "text" },
  });

  const watchShowType = watch("type");

  // useEffect(() => {
  //   (async () => {
  //     await Page.getPageDetailByPageName(pageName)
  //       .then((response) => {
  //         console.log({ data: response.data });
  //         setPageData(response.data.page);
  //         setFile(response.data.page.images);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         let message =
  //           error.response && error.response.data.message
  //             ? error.response.data.message
  //             : error.message;
  //         toast.error(t(message));
  //         setLoading(false);
  //       });
  //   })();
  // }, []);

  const onSubmit = async (values) => {
    var formData = new FormData();

    formData.append("category", values.category);
    formData.append("type", values.type);
    formData.append("title_vn", values.title_vn);
    formData.append("title_en", values.title_en);
    formData.append("text_vn", values.text_vn ? values.text_vn : "");
    formData.append("text_en", values.text_en ? values.text_en : "");
    formData.append("file_vn", values.file_vn);
    formData.append("file_en", values.file_en);

    await Posts.createPost(formData)
      .then((response) => {
        const { message } = response.data;
        toast.success(t(message));
        history.push("/admin/posts");
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("createNewPosts")}</h1>
          <div className="flex items-center gap-6">
            {/* <button
              onClick={handleSubmit((values) => onSubmit(values, "preview"))}
              className="w-64 flex justify-center items-center hover:underline font-bold rounded-full my-6 py-4 px-8 border shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              {t("saveDrap")}
            </button> */}
            <button
              className="w-64 flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                history.push("/admin/posts");
              }}
            >
              {t("list")}
            </button>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-10">
            <div className="mb-10">
              <span className="mb-2 block text-lg font-semibold text-gray-900">
                Tên bài viết tiếng việt :
              </span>
              <div>
                <input
                  id="title_vn"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  {...register("title_vn", {
                    required: t("required"),
                  })}
                ></input>
                <p className="error-message-text">{errors.title_vn?.message}</p>
              </div>
            </div>
            <div className="mb-10">
              <span className="mb-2 block text-lg font-semibold text-gray-900">
                Tên bài viết tiếng anh :
              </span>
              <div>
                <input
                  id="title_en"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  {...register("title_en", {
                    required: t("required"),
                  })}
                ></input>
                <p className="error-message-text">{errors.title_en?.message}</p>
              </div>
            </div>
            <div className="mb-10">
              <span className="mb-2 block text-lg font-semibold text-gray-900">
                Loại bài viết :
              </span>
              <div>
                <select
                  id="type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  {...register("type", {
                    required: t("required"),
                  })}
                >
                  <option value="text">Text</option>
                  <option value="file">File</option>
                </select>
                <p className="error-message-text">{errors.type?.message}</p>
              </div>
            </div>
            <div className="mb-10">
              <span className="mb-2 block text-lg font-semibold text-gray-900">
                Phân loại :
              </span>
              <div>
                <select
                  id="category"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  {...register("category", {
                    required: t("required"),
                  })}
                >
                  {cmsCategory.map((ele) => (
                    <option key={ele.category} value={ele.category}>
                      {t(ele.title)}
                    </option>
                  ))}
                </select>
                <p className="error-message-text">{errors.category?.message}</p>
              </div>
            </div>
            {watchShowType === "file" ? (
              <>
                <div className="mb-10">
                  <span className="mb-2 block text-lg font-semibold text-gray-900">
                    File tiếng Việt :
                  </span>
                  <UploadFile
                    onFileChange={(files) => setValue("file_vn", files[0])}
                  />
                </div>
                <div className="mb-10">
                  <span className="mb-2 block text-lg font-semibold text-gray-900">
                    File tiếng Anh :
                  </span>
                  <UploadFile
                    onFileChange={(files) => setValue("file_en", files[0])}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-10">
                  <span className="mb-2 block text-lg font-semibold text-gray-900">
                    Nội dung tiếng Việt :
                  </span>
                  <TextEditor
                    onChange={(content) => {
                      setValue("text_vn", content);
                    }}
                  />
                  <p className="error-message-text">
                    {errors.text_vn?.message}
                  </p>
                </div>
                <div className="mb-10">
                  <span className="mb-2 block text-lg font-semibold text-gray-900">
                    Nội dung tiếng Anh :
                  </span>
                  <TextEditor
                    onChange={(content) => {
                      setValue("text_en", content);
                    }}
                  />
                  <p className="error-message-text">
                    {errors.text_en?.message}
                  </p>
                </div>
              </>
            )}

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

export default CreatePostPage;
