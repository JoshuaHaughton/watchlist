//Detailed information retrieved from omdbapi about this specific movie
export const getDetails = async (id, navigate, setMyMedia, setRelatedMedia) => {

  //CURRENT MOVIE PAGE DETAILS

  //Get detailed response from OMDBapi based on current media's imdbID
  const detailedResponse = await (
    await fetch(`http://www.omdbapi.com/?apikey=420fa557&i=${id}`)
  ).json();

  //If imdbID is wrong(If user tries to find a page manually) send them back to home
  if (detailedResponse.Response === "False") {
    navigate('/')
    return;
  }

  //save to state
  setMyMedia(detailedResponse);


  // RECOMMENDED MOVIES


  //Searches by first 3 words of current movie title, or entire title if it is shorter
  let shortTitle = detailedResponse.Title;
  if (detailedResponse.Title.split(" ").length > 3) {
    shortTitle = `${detailedResponse.Title.split(" ")[0]} ${
      detailedResponse.Title.split(" ")[1]
    } ${detailedResponse.Title.split(" ")[2]}`;
  }


  const relatedDetailedResponse = await (
    await fetch(
      `http://www.omdbapi.com/?apikey=420fa557&s=${shortTitle}&type=movie`,
    )
  ).json();


  //Filters out the movie that is already showing
  const noDuplicates = relatedDetailedResponse.Search.filter((media) => {
    return media.imdbID !== id;
  });


  if (noDuplicates.length > 0) {
    setRelatedMedia(noDuplicates);
  }

};
