import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Email from "../../api/Email";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";

const ContactForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    await Email.createEmail(values)
      .then((response) => {
        setLoading(false);
        toast.success(t(response.data.message));
        reset();
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(t(message));
        setLoading(false);
      });
  };

  return (
    <section className="bg-white">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-2xl font-medium underline">
            {t("contactDirect")}
          </h1>
          <div>
            <label
              htmlFor="userName"
              className="block mb-2 text-lg font-medium text-gray-900 "
            >
              {t("fullname")}
            </label>
            <input
              type="text"
              id="userName"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder={t("pleaseInputFullname")}
              {...register("userName", {
                required: t("fullname is required"),
              })}
            />
            <p className="error-message-text">{errors.userName?.message}</p>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-lg font-medium text-gray-900 "
            >
              {t("phone")}
            </label>
            <input
              type="text"
              id="phone"
              className="block p-3 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 "
              placeholder={t("pleaseInputPhone")}
              {...register("phone", {
                required: t("phone is required"),
              })}
            />
            <p className="error-message-text">{errors.phone?.message}</p>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-lg font-medium text-gray-900 "
            >
              {t("yourEmail")}
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder={t("pleaseInputEmail")}
              {...register("email", {
                required: t("email is required"),
              })}
            />
            <p className="error-message-text">{errors.email?.message}</p>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block mb-2 text-lg font-medium text-gray-900 "
            >
              {t("message")}
            </label>
            <textarea
              id="message"
              rows="6"
              className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 "
              placeholder={t("pleaseInputMessage")}
              {...register("message", {
                required: t("message is required"),
              })}
            ></textarea>
            <p className="error-message-text">{errors.message?.message}</p>
          </div>
          <button
            type="submit"
            className="py-3 flex items-center gap-4 px-5 text-lg font-medium text-center text-white rounded-lg gradient sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 "
          >
            {t("adviseMe")}
            {loading && <Loading />}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
