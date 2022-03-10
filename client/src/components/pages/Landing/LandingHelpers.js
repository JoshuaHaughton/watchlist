import { apiConfig } from "../../../api/axiosClient";
import tmdbApi from "../../../api/tmdbApi";

//Fetch a random backdrop from the most popular movies on tmdbApi and set as the landing background
export const fetchBackgroundMovie = async (setBackgroundMovieTitle) => {
  const response = await tmdbApi.getMoviesList("popular");
  const randomIndex = Math.floor(Math.random() * response.results.length - 1);

  let src = null;

  if (response.results[randomIndex].backdrop_path) {
    src = apiConfig.originalImage(response.results[randomIndex].backdrop_path);
  } else if (response.results[randomIndex].poster_path) {
    src = apiConfig.originalImage(response.results[randomIndex].poster_path);
  }

  //Sets background image of landing div if it exists
    src &&
      (document.getElementById(
        "landing",
      ).style.backgroundImage = `url(${src})`);

  //Set title of background movie to be used as placeholder for input
  setBackgroundMovieTitle(response.results[randomIndex].title);
};
