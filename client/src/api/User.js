import API from "./API";
import APIUpload from "./APIUpload";
import { URL_API_USER } from "./URL";

const User = {
  update: (userId, body) => {
    // if (body.imgFront === "") {
    // console.log("not file");
    return API.put(`${URL_API_USER}/${userId}`, body);
    // } else {
    //   console.log("have file");
    //   const formData = new FormData();
    //   formData.append("walletAddress", body.walletAddress);
    //   formData.append("imgFront", body.imgFront);
    //   formData.append("imgBack", body.imgBack);

    //   return APIUpload.put(`${URL_API_USER}/${userId}`, formData);
    // }
  },
  getAllUsers: (pageNumber, keyword, statusSearch) => {
    return API.get(
      `${URL_API_USER}/?pageNumber=${pageNumber}&keyword=${keyword}&status=${statusSearch}`
    );
  },
  getUserById: (id) => {
    return API.get(`${URL_API_USER}/${id}`);
  },
  getProfile: () => {
    return API.get(`${URL_API_USER}/profile`);
  },
  changeStatus: (body) => {
    return API.put(`${URL_API_USER}/status`, body);
  },
  getTree: () => {
    return API.get(`${URL_API_USER}/tree`);
  },
  getListChild: () => {
    return API.get(`${URL_API_USER}/listChild`);
  },
};

export default User;
