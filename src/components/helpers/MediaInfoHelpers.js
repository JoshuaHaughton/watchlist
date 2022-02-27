import tmdbApi from "../../api/tmdbApi";

//Detailed information retrieved from omdbapi about this specific movie
export const getDetails = async (id, category, navigate, setMyMedia, setRelatedMedia) => {

  //CURRENT MOVIE PAGE DETAILS

  //Get detailed response from OMDBapi based on current media's imdbID
  const detailedResponse = await tmdbApi.details(category, id);
  console.log(detailedResponse)

  // const detailedResponse = await (
  //   await fetch(`https://www.omdbapi.com/?apikey=420fa557&i=${id}`)
  // ).json();

  //If imdbID is wrong(If user tries to find a page manually) send them back to home
  if (detailedResponse.success === "false") {
    navigate('/')
    return;
  }

  //save to state
  setMyMedia(detailedResponse);


  // RECOMMENDED MOVIES

  const similarMedia = await tmdbApi.similar(category, id)
  console.log(similarMedia.results, 'sim')


  // //Searches by first 3 words of current movie title, or entire title if it is shorter
  // let shortTitle = detailedResponse.Title;
  // if (detailedResponse.Title.split(" ").length > 3) {
  //   shortTitle = `${detailedResponse.Title.split(" ")[0]} ${
  //     detailedResponse.Title.split(" ")[1]
  //   } ${detailedResponse.Title.split(" ")[2]}`;
  // }


  // const relatedDetailedResponse = await (
  //   await fetch(
  //     `https://www.omdbapi.com/?apikey=420fa557&s=${shortTitle}&type=movie`,
  //   )
  // ).json();


  // //Filters out the movie that is already showing
  // const noDuplicates = relatedDetailedResponse.Search.filter((media) => {
  //   return media.imdbID !== id;
  // });

  const formattedSimilarMedia = similarMedia.results.map(media => ({...media, media_type: category}))

  if (formattedSimilarMedia.length > 0) {
    setRelatedMedia(formattedSimilarMedia);
  }

};
