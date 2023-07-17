import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import User from "@/api/User";
import { UPDATE_USER_INFO } from "@/slices/authSlice";
import FsLightbox from "fslightbox-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";

const UserProfile = (match) => {
  const { id } = match.match.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const [data, setData] = useState({});
  const [toggler, setToggler] = useState(false);

  const handleToggler = () => setToggler(!toggler);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    (async () => {
      await User.getUserById(id)
        .then((response) => {
          setLoading(false);
          setData(response.data);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.error
              ? error.response.data.error
              : error.message;
          toast.error(message);
          setLoading(false);
        });
    })();
  }, [id]);

  const onSubmit = async (data) => {
    const { walletAddress, imgFront, imgBack } = data;

    await User.update(id, {
      walletAddress,
      imgFront: imgFront[0],
      imgBack: imgBack[0],
    })
      .then((response) => {
        setLoading(false);
        toast.success(response.data.message);
        dispatch(UPDATE_USER_INFO(response.data.data));
      })
      .catch((error) => {
        let message =
          error.response && error.response.data.error
            ? error.response.data.error
            : error.message;
        toast.error(message);
        setLoading(false);
      });
  };

  return (
    <div>
      <ToastContainer />
      <div className="container mx-auto p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full lg:w-3/12 lg:mx-2 mb-4 lg:mb-0">
            <div className="bg-white shadow-md p-3 border-t-4 border-primary">
              <ul className=" text-gray-600 py-2 px-3 mt-3 divide-y rounded">
                <li className="flex items-center py-3">
                  <span>{t("status")}</span>
                  <span className="ml-auto">
                    <span
                      className={`${
                        data.status === "UNVERIFY"
                          ? "bg-red-600"
                          : data.status === "PENDING"
                          ? "bg-yellow-600"
                          : data.status === "APPROVED"
                          ? "bg-green-600"
                          : data.status === "REJECTED"
                          ? "bg-red-600"
                          : data.status === "LOCKED"
                          ? "bg-red-600"
                          : ""
                      }  py-1 px-2 rounded text-white text-sm`}
                    >
                      {t(data.status)}
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>{t("memberSince")}</span>
                  <span className="ml-auto">
                    {new Date(data.createdAt).toLocaleDateString("vi")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full lg:w-9/12 lg:mx-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="bg-white p-6 shadow-md rounded-sm border-t-4 border-primary"
            >
              <div className="text-gray-700">
                <div className="grid grid-cols-1 text-sm">
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("user name")}
                    </div>
                    <div className="px-4 py-2">{data.userId}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div className="px-4 py-2">{data.email}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">{t("phone")}</div>
                    <div className="px-4 py-2">{data.phone}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("walletAddress")}
                    </div>
                    <div className="px-4 py-2 break-words">
                      {data.walletAddress}
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("isRegistered")}
                    </div>
                    <div className="px-4 py-2">
                      {data.countPay >= 1 ? t("finished") : t("unfinished")}
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("count pay")}
                    </div>
                    <div className="px-4 py-2">
                      {data.countPay === 0 ? 0 : data.countPay - 1} {t("times")}
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">Tier</div>
                    <div className="px-4 py-2">{data.tier + 1}</div>
                  </div>
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">{t("fine")}</div>
                    <div className="px-4 py-2">{data.fine}</div>
                  </div>

                  {data.status === "APPROVED" &&
                    data.listDirectUser.length > 0 && (
                      <>
                        <div className="grid lg:grid-cols-2 grid-cols-1">
                          <div className="px-4 py-2 font-semibold">
                            {t("children")}
                          </div>
                          <div className="px-4 py-2">
                            <ul>
                              {data.listDirectUser.map((ele) => (
                                <li
                                  className="bg-white border-b hover:bg-gray-50"
                                  key={ele._id}
                                >
                                  <div className="py-2">
                                    <div className="text-base">
                                      <span className="font-semibold">
                                        {ele.userId}
                                      </span>
                                      {/* <br></br>
                                    {ele._id}
                                    <br></br>
                                    {ele.email}
                                    <br></br>
                                    {ele.walletAddress}
                                    <br></br> */}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}

                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("idCardFront")}
                    </div>
                    <img
                      onClick={handleToggler}
                      src={data.imgFront}
                      className="w-full px-4 py-2"
                    />
                  </div>
                  <FsLightbox
                    toggler={toggler}
                    sources={[data.imgFront, data.imgBack]}
                  />
                  <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="px-4 py-2 font-semibold">
                      {t("idCardBack")}
                    </div>

                    <img
                      onClick={handleToggler}
                      src={data.imgBack}
                      className="w-full px-4 py-2"
                    />
                  </div>
                </div>
              </div>
              {/* <button
                type="submit"
                className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                {loading && <Loading />}
                Update
              </button> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
