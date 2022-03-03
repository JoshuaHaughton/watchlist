import axiosClient, { apiConfig } from "./axiosClient";

// export const category = {
//   movie: 'movie',
//   tv: 'tv'
// }

// export const movieType = {
//   upcoming: 'upcoming',
//   popular: 'popular',
//   top_rated: 'top_rated'
// }

// export const tvType = {
//   popular: 'popular',
//   top_rated: 'top_rated',
//   on_the_air: 'on_the_air'
// }

const tmdbApi = {
  getMoviesList: (type, params = {}) => {
    const url = `movie/${String(type)}?api_key=${apiConfig.apiKey}&page=1`;
    return axiosClient.get(url, params)
  },
  getMediaCredits: (category, id, params = {}) => {
    const url = `${category}/${id}/credits?api_key=${apiConfig.apiKey}`;
    return axiosClient.get(url, params)
  },
  getTvList: (type, params = {}) => {
    const url = `tv/${String(type)}?api_key=${apiConfig.apiKey}`;
    return axiosClient.get(url, params)
  },
  getMediaList: (type, media, params = {}) => {
    const url = `${media}/${String(type)}?api_key=${apiConfig.apiKey}`;
    return axiosClient.get(url, params)
  },
  getActorDetails: (id, params = {}) => {
    const url = `person/${id}?api_key=${apiConfig.apiKey}`;
    return axiosClient.get(url, params)
  },
  getVideos: (category, id) => {
    const url = `${category}/${id}/videos?api_key=${apiConfig.apiKey}`;
    return axiosClient.get(url, {params: {}})
  },
  search: (query, params = {}) => {
    const url = `search/multi?api_key=${apiConfig.apiKey}&query=${query}`;
    return axiosClient.get(url, params)
  },
  details: (category, id, params = {}) => {
    const url = `${String(category)}/${id}?api_key=${apiConfig.apiKey}`;
    return axiosClient.get(url, params)
  },
  credits: (category, id) => {
    const url = `${String(category)}/${id}/credits?api_key=${apiConfig.apiKey}`;
    return axiosClient.get(url, {params: {}})
  },
  similar: (category, id) => {
    const url = `${String(category)}/${id}/similar?api_key=${apiConfig.apiKey}`;
    return axiosClient.get(url, {params: {}})
  }
};

export default tmdbApi;