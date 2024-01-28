import { useTranslation } from "react-i18next";
import "./index.css";
import { toast } from "react-toastify";
import Page from "../../api/Page";
import { useEffect, useState } from "react";

const OurTeamPageContent = () => {
  const { t, i18n } = useTranslation();
  const pageName = "cms-ourTeam";
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    (async () => {
      await Page.getPageDetailByPageName(pageName)
        .then((response) => {
          setPageData(response.data.page);
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
      <div className="relative pt-24 z-20">
        <div className="container mt-10 mx-auto flex justify-center">
          <img
            className="w-full rounded-2xl max-h-96 object-cover "
            src={pageData?.images[0]}
            alt="about-us-banner"
          />
        </div>
        <div className="">
          <svg
            viewBox="0 0 1428 174"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g
                transform="translate(-2.000000, 44.000000)"
                fill="#FFFFFF"
                fillRule="nonzero"
              >
                <path
                  d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
                  opacity="0.100000001"
                ></path>
                <path
                  d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                  opacity="0.100000001"
                ></path>
                <path
                  d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
                  id="Path-4"
                  opacity="0.200000003"
                ></path>
              </g>
              <g transform="translate(-4.000000, 76.000000)" fill="#FFFFFF">
                <path d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z"></path>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <section className="bg-white py-8">
        <div className="container mx-auto flex flex-wrap pt-4 pb-12">
          <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
            {t("ourTeam")}
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
          <div className="w-full mt-10">
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-10">
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/6-1536x1536-1-pvlu4g64435abnb55wleum3jtxzaset0cokskbypbc.png" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    PIERRE NGUYEN
                  </div>
                  <div className="text-gray-600">President - American</div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/8-1536x1536-1-pvlu4f89x94001cibe6sa4c38k3xkppa0jxb3203hk.png" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    SONYA DANG
                  </div>
                  <div className="text-gray-600">Vice President - American</div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/DAN-LEMKUIL-90-pbtb771bfe7lz50x1pppwdjkf1h1lhmbf3p0dw15hw-pwf8rmgj3ggzlap9o64rvw3lhmuneyizthexme58dk.jpeg" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    DANIEL LEMKUIL
                  </div>
                  <div className="text-gray-600">
                    Vice President / Legal Relations - American
                  </div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/l%C3%ACnh-pvlu4f89x94001cibe6sa4c38k3xkppa0jxb3203hk.jpg" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    LINH DANG
                  </div>
                  <div className="text-gray-600">
                    North America Operations Director - American
                  </div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/Giang-1536x1536-1-pvlu4g64435abnb55wleum3jtxzaset0cokskbypbc.jpg" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    ĐẶNG TRƯỜNG GIANG
                  </div>
                  <div className="text-gray-600">
                    HR / Marketing Director - American
                  </div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/Nguyen-Huu-Loc-2-pbtb7fhv4wj6vmomobdd0tepribcirjwg9kdpdolxw-pwf8v3h2cf84hfnoe665lijwhvqgupbamo6ig6zve0.jpeg" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    NGUYEN HUU LOC
                  </div>
                  <div className="text-gray-600">
                    Vice President of Sale - American
                  </div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/5-1536x1536-1-pvlu4g64435abnb55wleum3jtxzaset0cokskbypbc.png" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    WILLIAM TRAN
                  </div>
                  <div className="text-gray-600">
                    Director Of Intl. Business Development - American
                  </div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/dfaad925a2535e0d0742.jpg-2020-09-10-15-59-26-2020-09-10-16-04-03-pvlu4g64435abnb55wleum3jtxzaset0cokskbypbc.png" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    TRUONG THANH VAN
                  </div>
                  <div className="text-gray-600">
                    IT Chief Of Security Officer - American
                  </div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/4-1536x1536-1-pvlu4g64435abnb55wleum3jtxzaset0cokskbypbc.png" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    NGUYEN HUYNH DUA
                  </div>
                  <div className="text-gray-600">
                    IT Chief Of Staff Officer - American
                  </div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/z3715625155413_5ca9ef4132f1a479b2d65b5093bdd48e-pvlu4h3yax6kn99s0f01f3v0fbuo03wqot8a1lxb54.jpg" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    LE THI KIM ANH
                  </div>
                  <div className="text-gray-600">VP Assistant - American</div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/ke-toan-pwf8y97jbdjti92gy1c0h7uodi5vq2uteb49iob8h4.jpeg" />
                <div className="mt-2">
                  {/* <div className="uppercase font-semibold text-lg">
                    WILLIAM TRAN
                  </div> */}
                  <div className="text-gray-600">
                    Chief Accountant officer - American
                  </div>
                </div>
              </div>
              <div className="text-black text-center">
                <img src="https://ameritecjsc.com.vn/wp-content/uploads/elementor/thumbs/IMG_8459.JPG-2020-09-09-16-48-42-pvlu4g64435abnb55wleum3jtxzaset0cokskbypbc.png" />
                <div className="mt-2">
                  <div className="uppercase font-semibold text-lg">
                    DAO TRONG CHUONG
                  </div>
                  <div className="text-gray-600">IT Officer - American</div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="text-gray-800">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  i18n.language === "vi"
                    ? pageData?.content_vn
                    : pageData?.content_en,
              }}
            />
          </div> */}
        </div>
      </section>
      <svg
        className="wave-top"
        viewBox="0 0 1439 147"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-1.000000, -14.000000)" fillRule="nonzero">
            <g className="wave" fill="#f8fafc">
              <path d="M1440,84 C1383.555,64.3 1342.555,51.3 1317,45 C1259.5,30.824 1206.707,25.526 1169,22 C1129.711,18.326 1044.426,18.475 980,22 C954.25,23.409 922.25,26.742 884,32 C845.122,37.787 818.455,42.121 804,45 C776.833,50.41 728.136,61.77 713,65 C660.023,76.309 621.544,87.729 584,94 C517.525,105.104 484.525,106.438 429,108 C379.49,106.484 342.823,104.484 319,102 C278.571,97.783 231.737,88.736 205,84 C154.629,75.076 86.296,57.743 0,32 L0,0 L1440,0 L1440,84 Z"></path>
            </g>
            <g transform="translate(1.000000, 15.000000)" fill="#FFFFFF">
              <g transform="translate(719.500000, 68.500000) rotate(-180.000000) translate(-719.500000, -68.500000) ">
                <path
                  d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
                  opacity="0.100000001"
                ></path>
                <path
                  d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                  opacity="0.100000001"
                ></path>
                <path
                  d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
                  opacity="0.200000003"
                ></path>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

export default OurTeamPageContent;
