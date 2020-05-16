const logResponse = (response, request) => {
  let resp = response;
  let type = request;
  let error = null;
  if (!request) {
    resp = response.response;
    error = resp && resp.data && resp.data.error && resp.data.error.message;
    type = resp && resp.config.url;
  }

  const logObject = {
    REQUEST: type,
    STATUS: resp && resp.status,
    STATUS_TEXT: resp && resp.statusText,
    ERROR: error,
  };
  console.log(logObject);
};

module.exports = logResponse;