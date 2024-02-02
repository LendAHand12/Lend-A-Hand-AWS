import API from "./API";
import { URL_API_USER } from "./URL";

const Admin = {
  update: (userId, body) => {
    return API.put(`${URL_API_USER}/admin/${userId}`, body);
  },
  getAllAdmins: (pageNumber, keyword) => {
    return API.get(
      `${URL_API_USER}/admin/?pageNumber=${pageNumber}&keyword=${keyword}`
    );
  },
  getAdminById: (id) => {
    return API.get(`${URL_API_USER}/admin/${id}`);
  },
  deleteAdminById: (id) => {
    return API.delete(`${URL_API_USER}/admin/${id}`);
  },
  getProfileAdmin: (id) => {
    return API.get(`${URL_API_USER}/admin/${id}`);
  },
};

export default Admin;
