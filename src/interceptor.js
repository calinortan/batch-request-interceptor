function batchInterceptor(instance) {
  instance.interceptors.request.use(
    (request) => {
      // Add your code here
      console.log("INTERCEPT", request);
      return request;
    },
    (error) => Promise.reject
  );
}
export default batchInterceptor;
