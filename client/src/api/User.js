import API from "./API";
import { URL_API_USER } from "./URL";

const User = {
  update: (userId, body) => {
    return API.put(`${URL_API_USER}/${userId}`, body);
  },
  getAllUsers: (pageNumber, keyword, statusSearch) => {
    return API.get(
      `${URL_API_USER}/?pageNumber=${pageNumber}&keyword=${keyword}&status=${statusSearch}`
    );
  },
  getUserById: (id) => {
    return API.get(`${URL_API_USER}/${id}`);
  },
  deleteUserById: (id) => {
    return API.delete(`${URL_API_USER}/${id}`);
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
  getChildsOfUserForTree: (body) => {
    return API.post(`${URL_API_USER}/treeNode`, body);
  },
  getListChild: () => {
    return API.get(`${URL_API_USER}/listChild`);
  },
  getTreeOfUser: (id) => {
    return API.get(`${URL_API_USER}/tree/${id}`);
  },
  getAllUsersWithKeyword: (body) => {
    return API.post(`${URL_API_USER}/getAllUsersWithKeyword`, body);
  },
  changeSystem: (body) => {
    return API.post(`${URL_API_USER}/changeSystem`, body);
  },
  getChildrenList: () => {
    return API.get(`${URL_API_USER}/getChildrenList`);
  },
  getAllDeletedUsers: (pageNumber, keyword) => {
    return API.get(
      `${URL_API_USER}/getAllDeletedUsers/?pageNumber=${pageNumber}&keyword=${keyword}`
    );
  },
  getAllUsersForExport: () => {
    return API.get(`${URL_API_USER}/getAllUsersForExport`);
  },
  getMailChangeWallet: () => {
    return API.get(`${URL_API_USER}/changeWallet`);
  },
  changeWallet: (body) => {
    return API.post(`${URL_API_USER}/changeWallet`, body);
  },
};

export default User;
