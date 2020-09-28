import axios from "axios";
import { Message } from 'element-ui';

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devapi";
// 创建axios拦截器
const service = axios.create({
  baseURL: BASEURL,
  timeout: 1000,
});


// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  // 对响应数据做点什么
  function (response) {
    let data = response.data
    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
      return Promise.resolve;
    }
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

/*     .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    }); */

export default service;
