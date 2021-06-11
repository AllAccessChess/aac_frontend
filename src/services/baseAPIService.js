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
      .then((res) => {
        if (res.data.status !== "ok" && res.data.error)
          throw new Error(res.data.error);
        return res.data;
      });
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
      .then(async (res) => {
        if (res.data.status !== "ok" && res.data.error)
          throw new Error(res.data.error);
        if (
          res.data.warnings &&
          res.data.warnings.includes("Warning.OldToken")
        ) {
          let data = { ...res.data };
          const response = await this.requestWithAuth("/auth/renew", "GET");
          StorageService.setAuthToken({
            token: response.token,
            expiry: response.expiry,
          });
          data.warnings.splice(data.warnings.indexOf("Warning.OldToken"));
          return data;
        }
        return res.data;
      });
  };
}
