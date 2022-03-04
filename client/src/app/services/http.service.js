import axios from 'axios';
import { toast } from 'react-toastify';
import configFile from '../config.json';
import authService from './auth.service';
import localStorageService from './localStorage.service';

const http = axios.create({
  baseURL: configFile.apiEndPoint,
});

http.interceptors.request.use(
  async (config) => {
    const expiresDate = localStorageService.getTokenExpiresDate();
    const refreshToken = localStorageService.getRefreshToken();
    const isExpired = refreshToken && expiresDate < Date.now();

    if (configFile.isFirebase) {
      const containSlash = /\/$/gi.test(config.url);
      config.url =
        (containSlash ? config.url.slice(0, -1) : config.url) + '.json';
      if (isExpired) {
        const data = await authService.refreshToken();
        localStorageService.setTokens({
          refreshToken: data.refresh_token,
          idToken: data.id_token,
          expiresIn: data.expires_in,
          localId: data.user_id,
        });
      }
      const accessToken = localStorageService.getAccessToken();
      if (accessToken) {
        config.params = { ...config.params, auth: accessToken };
      }
    } else {
      if (isExpired) {
        const data = await authService.refreshToken();

        localStorageService.setTokens(data);
      }
      const accessToken = localStorageService.getAccessToken();
      if (accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const transformData = (data) => {
  return data && !data._id
    ? Object.keys(data).map((key) => ({
        ...data[key],
      }))
    : data;
};

http.interceptors.response.use(
  (res) => {
    res.data = { content: transformData(res.data) };
    return res;
  },
  (error) => {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedErrors) {
      console.log(error);
      toast.error('Something went wrong. Try it later');
    }
    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};

export default httpService;
