const axios = require('axios');

module.exports = (dbApiUrl) => ({
  post: ({ path, data }) => axios.post(`${dbApiUrl}${path}`, data),
  put: ({ path, data }) => axios.put(`${dbApiUrl}${path}`, data),
  get: ({ path }) => axios.get(`${dbApiUrl}${path}`),
});
