import API from "./API";
import { URL_API_PAGE } from "./URL";

const Page = {
  getAllPages: () => {
    return API.get(URL_API_PAGE);
  },
  getPageDetailByPageName: (pageName) => {
    return API.get(`${URL_API_PAGE}/${pageName}`);
  },
  updatePage: (body) => {
    return API.post(URL_API_PAGE, body);
  },
};

export default Page;
