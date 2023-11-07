import API from "./API";
import { URL_API_PAYMENT } from "./URL";

const Payment = {
  getPaymentInfo: (continueWithBuyPackageB) => {
    return API.get(
      `${URL_API_PAYMENT}/info?continueWithBuyPackageB=${continueWithBuyPackageB}`
    );
  },
  addPayment: (body) => {
    return API.post(`${URL_API_PAYMENT}`, body);
  },
  onDonePayment: (body) => {
    return API.post(`${URL_API_PAYMENT}/done`, body);
  },
  getAllPayments: (pageNumber, keyword, statusSearch) => {
    return API.get(
      `${URL_API_PAYMENT}/user/?pageNumber=${pageNumber}&keyword=${keyword}&status=${statusSearch}`
    );
  },
  getPaymentsOfUser: (pageNumber) => {
    return API.get(`${URL_API_PAYMENT}/?pageNumber=${pageNumber}`);
  },
  getPaymentDetail: (id) => {
    return API.get(`${URL_API_PAYMENT}/${id}`);
  },
  checkCanRefund: (body) => {
    return API.post(`${URL_API_PAYMENT}/checkCanRefund`, body);
  },
  changeToRefunded: (body) => {
    return API.post(`${URL_API_PAYMENT}/changeToRefunded`, body);
  },
  onAdminDoneRefund: (body) => {
    return API.post(`${URL_API_PAYMENT}/onAdminDoneRefund`, body);
  },
  getAllTransForExport: (body) => {
    return API.post(`${URL_API_PAYMENT}/getAllTransForExport`, body);
  },
};

export default Payment;
