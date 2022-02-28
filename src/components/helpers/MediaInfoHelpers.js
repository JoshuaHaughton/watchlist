import tmdbApi from "../../api/tmdbApi";

//Detailed information retrieved from tmdbApi about this specific movie
export const getDetails = async (id, category, setMyMedia, setRelatedMedia) => {

  //CURRENT MOVIE PAGE DETAILS

  //Get detailed response from tmdbApi based on current media's imdbID
  const detailedResponse = await tmdbApi.details(category, id);
  console.log(detailedResponse)

  //save to state
  setMyMedia(detailedResponse);



  // RECOMMENDED MOVIES

  const similarMedia = await tmdbApi.similar(category, id)
  console.log(similarMedia.results, 'sim')

  
  //Attatch a property to every result that identifies the type (movie or tv series)
  const formattedSimilarMedia = similarMedia.results.map(media => ({...media, media_type: category}))

  if (formattedSimilarMedia.length > 0) {
    setRelatedMedia(formattedSimilarMedia);
  }

};
