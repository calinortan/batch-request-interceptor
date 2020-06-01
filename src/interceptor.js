import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import includes from "lodash/includes";
import httpAdapter from "axios/lib/adapters/http";
import createError from "axios/lib/core/createError";

// batch interval in ms
const batchInterval = 500;

var batchedRequests = [];
var batchedRequestPromise;

/**
 * Makes sure duplicated ids are avoided
 */
const getBatchParams = () => {
  return batchedRequests.reduce((acc, current) => {
    const ids = get(current, "params.ids", []);

    return [...new Set([...acc, ...ids])];
  }, []);
};

/**
 * Returns an adapted config object, containing all needed params
 * @param config - adapter function parameter
 */
const getAdaptedConfig = (config) => {
  const batchedIds = getBatchParams();
  if (isEmpty(batchedIds)) {
    return config;
  }

  return { ...config, params: { ...config.params, ids: batchedIds } };
};

/**
 * Used to resolve each response according to the initial request
 * @param config - adapter function parameter
 */
const getResolver = (config) => {
  return (res) => {
    const ids = get(config, "params.ids", []);

    const data = JSON.parse(res.data);

    const items = get(data, "items", []).filter((id) => includes(ids, id));

    if (isEmpty(items)) {
      return Promise.reject(createError("Not found!", config, 404));
    }

    return Promise.resolve({ ...res, data: { items } });
  };
};

/**
 * Axios custom adapter to intercept de api
 * @param config - adapter function parameter
 */
const batchAdapter = (config) => {
  if (!isEmpty(batchedRequests)) {
    batchedRequests.push(config);

    return batchedRequestPromise;
  } else {
    batchedRequests.push(config);
    batchedRequestPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        httpAdapter(getAdaptedConfig(config))
          .then(resolve)
          .catch(reject)
          .finally(() => (batchedRequests = []));
      }, batchInterval);
    });

    return batchedRequestPromise;
  }
};

function batchInterceptor(instance) {
  instance.interceptors.request.use(
    (request) => {
      request.adapter = (config) =>
        batchAdapter(config).then(getResolver(config));

      return request;
    },
    (error) => Promise.reject(error)
  );
}
export default batchInterceptor;
