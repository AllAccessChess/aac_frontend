import axios from "utils/axios";
import https from "https";
import config from "config";

import StorageService from "./storageService";
const baseURL = config.apiURL || "";

export default class BaseAPIService {
  static request = (
    url,
    method,
    data,
    timeout = 0,
    contentType = "application/json"
  ) => {
    return axios
      .request({
        url: baseURL + url,
        headers: {
          "Content-Type": contentType,
        },
        method,
        data,
        timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((res) => res.data);
  };

  static requestWithAuth = (
    url,
    method,
    data,
    timeout = 0,
    contentType = "application/json"
  ) => {
    const tokenData = StorageService.getAuthToken();
    const token =
      tokenData && tokenData.token ? `Bearer ${tokenData.token}` : "";
    return axios
      .request({
        url: baseURL + url,
        headers: {
          Authorization: token,
          "Content-Type": contentType,
        },
        method,
        data,
        timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then((res) => res.data);
  };
}
