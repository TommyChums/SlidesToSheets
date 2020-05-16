const logResponse = (response, request) => {
  let resp = response;
  let type = request;
  let error = null;
  if (!request) {
    resp = response.response;
    error = resp.data.error.message;
    type = resp.config.url;
  }

  const logObject = {
    REQUEST: type,
    STATUS: resp.status,
    STATUS_TEXT: resp.statusText,
    ERROR: error,
  };
  console.log(logObject);
};

module.exports = logResponse;