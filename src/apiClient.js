import axios from "axios";
import batchInterceptor from "./interceptor";

const client = () => {
  const config = {
    baseURL: "/v1",
    headers: {},
  };
  const instance = axios.create(config);
  batchInterceptor(instance);
  return instance;
};

export default client;
