import { apiConfig } from "../../api/axiosClient";
import tmdbApi from "../../api/tmdbApi";

//Detailed information retrieved from tmdbApi about this specific movie
export const getDetails = async (id, category, setMyMedia, setRelatedMedia, setCast) => {

  //CURRENT MOVIE PAGE DETAILS

  //Get detailed response from tmdbApi based on current media's imdbID
  const detailedResponse = await tmdbApi.details(category, id);
  console.log(detailedResponse)

  //save to state
  setMyMedia(detailedResponse);


  if(detailedResponse.backdrop_path) {
    const src = apiConfig.originalImage(detailedResponse.backdrop_path)

    //Sets background image of landing div
    document.getElementById('media__container').style.backgroundImage=`url(${src})`;
  }




  // CAST

  const resp = await tmdbApi.getMediaCredits('movie', id);

  // const pic = apiConfig.w500Image(resp.cast[0].profile_path)
  // console.log(pic)

  const castArray = resp.cast.slice(0, 10);

  setCast(castArray)




  // RECOMMENDED MOVIES

  const similarMedia = await tmdbApi.similar(category, id)
  console.log(similarMedia.results, 'sim')

  //Prevents the selected movie from showing up in the suggested movie section (rare issue)
  const uniqueSimilarMovies = similarMedia.results.filter(item => item.id !== id)

  console.log(uniqueSimilarMovies, 'yyy')

  
  //Attatch a property to every result that identifies the type (movie or tv series)
  const formattedSimilarMedia = uniqueSimilarMovies.map(media => ({...media, media_type: category}))

  if (formattedSimilarMedia.length > 0) {
    setRelatedMedia(formattedSimilarMedia);
  }

};
