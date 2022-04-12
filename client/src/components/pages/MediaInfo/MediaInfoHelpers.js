import axios from "axios";
import { apiConfig } from "../../../api/axiosClient";
import tmdbApi from "../../../api/tmdbApi";


//Detailed information retrieved from tmdbApi about this specific movie or series
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

  const resp = await tmdbApi.getMediaCredits(category, id);

  // const pic = apiConfig.w500Image(resp.cast[0].profile_path)
  // console.log(pic)

  const castArray = resp.cast.slice(0, 10);

  setCast(castArray)




  // RECOMMENDED MOVIES

  const similarMedia = await tmdbApi.similar(category, id)
  console.log(similarMedia.results, 'similar')
  console.log(id, 'id')

  //Prevents the selected movie from showing up in the suggested movie section (rare issue)
  const uniqueSimilarMovies = similarMedia.results.filter(item => Number(item.id) !== Number(id))

  
  //Attatch a property to every result that identifies the type (movie or tv series)
  const formattedSimilarMedia = uniqueSimilarMovies.map(media => ({...media, media_type: category}))

  if (formattedSimilarMedia.length > 0) {
    setRelatedMedia(formattedSimilarMedia);
  }

};



export const addMediaToWatchlist = async (savedData, setLoading, setAddedToWatchlist, addedToWatchlist) => {
  setLoading(true)

  const response = await axios.put('https://watchlist-server1.herokuapp.com/my-list', savedData, {withCredentials: true})
    .catch((res) => {
      console.log('ERROR RES MEDIA INFO save media', res.response);
      return;
    });

    const success = response.status === 201;

    if (success) {
      if (!addedToWatchlist) {
        setAddedToWatchlist(true)
      }
    }

    setLoading(false)
}




 //Check if item exists in user watchlist
 export const checkWatchlistForItem = async (id, setLoading, setAddedToWatchlist) => {

  setLoading(true)

  const response = await axios.get('https://watchlist-server1.herokuapp.com/my-list', {withCredentials: true});


  if (!response) {
    setAddedToWatchlist(false)
    setLoading(false)
    return;
  } else {
    const foundItem = response.data.find(element => {
      return element.tmdb_id === id
    })

    if (foundItem !== undefined) {
      setAddedToWatchlist(true)
    } else {
      setAddedToWatchlist(false)
    }
    setLoading(false)

  } 
}