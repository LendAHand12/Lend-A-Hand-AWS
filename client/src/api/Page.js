import API from "./API";
import { URL_API_PAGE } from "./URL";

const Page = {
  getAllPages: () => {
    return API.get(URL_API_PAGE);
  },
  getPageDetailByPageName: (pageName) => {
    return API.get(`${URL_API_PAGE}/${pageName}`);
  },
  updatePage: (pageName, body) => {
    return API.put(`${URL_API_PAGE}/${pageName}`, body);
  },
};

export default Page;
