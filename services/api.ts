import { getAPIClient } from "./axios";
import axios, { AxiosResponse } from "axios";
import { parseCookies } from "nookies";
import Router from "next/router";
import { HelperServices } from "./helper.services";

export const api = getAPIClient();
const BASE_URL = HelperServices().BaseURL;

export async function Put(
  method: string,
  data: any | null
): Promise<AxiosResponse<any, any> | any> {
  try {
    const { "nextauth.token": token } = parseCookies();
    if (token != null && token != "") {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      return await axios.put(BASE_URL + method, data, {
        headers,
      });
    } else {
      return await axios.put(BASE_URL + method, data);
    }
  } catch (error: any) {
    if (error.response.status == 401) {
      Router.push("/");
    }
  }
}

export async function Post(
  method: string,
  data: any | null
): Promise<AxiosResponse<any, any> | any> {
  try {
    const { "nextauth.token": token } = parseCookies();
    if (token != null && token != "") {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      return await axios.post(BASE_URL + method, data, {
        headers,
      });
    } else {
      return await axios.post(BASE_URL + method, data);
    }
  } catch (error: any) {
    if (error.response.status == 401) {
      Router.push("/");
    }
  }
}

export async function PostAuth(
  method: string,
  data: any | null
): Promise<AxiosResponse<any, any> | any> {
  try {
    const { "nextauth.token": token } = parseCookies();
    if (token != null && token != "") {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      return await axios.post(BASE_URL + method, data, {
        headers,
      });
    } else {
      return await axios.post(BASE_URL + method, data);
    }
  } catch (error: any) {
    if (error.response.status == 401) {
      return null;
    }
  }
}

export async function Delete(
  method: string,
  params?: string | null | undefined
): Promise<AxiosResponse<any, any> | any> {
  try {
    params = params == null || params == undefined ? "" : params;

    const { "nextauth.token": token } = parseCookies();

    if (token != null && token != "") {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      return await axios.delete(BASE_URL + method + params ?? "", {
        headers,
      });
    } else {
      return await axios.delete(BASE_URL + method + params ?? "");
    }
  } catch (error: any) {
    const errosRedirect = [401, 404];
    if (errosRedirect.find((x) => x == error.response.status)) {
      Router.push("/");
      return {
        status: error.response.status,
      };
    }
  }
}

export async function Get(
  method: string,
  params?: string | null | undefined
): Promise<AxiosResponse<any, any> | any> {
  try {
    params = params == null || params == undefined ? "" : params;

    const { "nextauth.token": token } = parseCookies();

    if (token != null && token != "") {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      return await axios.get(BASE_URL + method + params ?? "", {
        headers,
      });
    } else {
      return await axios.get(BASE_URL + method + params ?? "");
    }
  } catch (error: any) {
    const errosRedirect = [401, 404];
    if (errosRedirect.find((x) => x == error.response.status)) {
      Router.push("/");
      return {
        status: error.response.status,
      };
    }
  }
}
