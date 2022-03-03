import axios from 'axios';
import queryString from 'query-string';


export const apiConfig = {
  baseURL: 'https://api.themoviedb.org/3/',
  apiKey: '0658e9a529a456bc6dcc84e8eee2abed',
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
};

const axiosClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {'Content-Type': 'application.json'},
  paramsSerializer: params => queryString.stringify({...params, api_key: apiConfig.apiKey})
})

axiosClient.interceptors.request.use(async (config) => config)

axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data;
  }

  return response;
}, (err) => {
  throw err;
})

export default axiosClient