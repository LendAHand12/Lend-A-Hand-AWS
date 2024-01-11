import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function UploadMultiImage({ files, setFile }) {
  const [message, setMessage] = useState();
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (e) => {
      setMessage("");
      setUploading(true);
      let file = e.target.files;
      let resultFile = [...files];
      for (let i = 0; i < file.length; i++) {
        const fileType = file[i]["type"];
        const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
        if (validImageTypes.includes(fileType)) {
          const imageUploadUrl = await uploadImage(file[i]);
          if (imageUploadUrl) {
            resultFile.push(imageUploadUrl);
          }
        } else {
          setMessage("Chỉ chấp nhận hình ảnh có định dạng JPEG, JPG, PNG");
          setUploading(false);
        }
      }
      setFile([...resultFile]);
      setUploading(false);
    },
    [files]
  );

  const removeImage = (i) => {
    setFile(files.filter((x) => x !== i));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sdblmpca");
    return axios
      .post(`${import.meta.env.VITE_CLOUDINARY_URL}/image/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data.secure_url;
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast.error(message);
      });
  };

  return (
    <div>
      <div className="flex justify-center items-center px-3">
        <div className="rounded-lg shadow-xl bg-gray-50 md:w-1/2 w-[360px]">
          <div className="m-4">
            <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">
              {message}
            </span>
            <div className="flex items-center justify-center w-full">
              <label className="flex cursor-pointer flex-col w-full h-32 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                    {uploading ? "Đang tải ảnh lên..." : "Chọn hình ảnh"}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFile}
                  className="opacity-0"
                  multiple="multiple"
                  name="files[]"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((file, key) => {
                return (
                  <div key={key} className="overflow-hidden relative">
                    <i className="mdi mdi-close "></i>
                    <span
                      onClick={() => {
                        removeImage(file);
                      }}
                      className="absolute right-1 top-1 hover:text-white cursor-pointer"
                    >
                      <svg
                        fill="red"
                        width="24px"
                        height="24px"
                        viewBox="-3.5 0 19 19"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
                      </svg>
                    </span>
                    <img
                      className="h-40 w-40 rounded-md object-cover"
                      src={file}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
