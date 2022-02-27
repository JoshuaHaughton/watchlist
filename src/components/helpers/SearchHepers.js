import tmdbApi from "../../api/tmdbApi";

export const sortResults = (filter, results, setResults, setSortValue) => {
  //Visually changes value of filter for user
  setSortValue(filter);

  if (filter === "OLDEST") {
    setResults(results.slice().sort((a, b) => {
      return a.Year - b.Year
    }));
  }

  if (filter === "NEWEST") {
    setResults(results.slice().sort((a, b) => b.Year - a.Year));
  }

  if (filter === "TITLE") {
    setResults(
      results.slice().sort((a, b) =>
        a.Title.localeCompare(b.Title, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      ),
    );
  }
};

//Returns list of movies from OMDapi for given query
export const fetchQueryData = async (query, setResults, setValid, setLoading, setErrorMessage) => {

  if (query !== "") {
    // let response = await (
    //   await fetch(
    //     `https://www.omdbapi.com/?apikey=420fa557&s=${query}&type=movie&page=1`,
    //   )
    // ).json();

    console.log(query)
    console.log(String(query))
    let response = await tmdbApi.search(query);
    console.log("response1", response)

    response = await response.results.filter(result => {
      return result.media_type !== 'person'
    })



    console.log("response2", response)

    if (response.Response === "False") {
      //This error happens because too many results come back... search is too broad
      //Searches for the given query as a title instead of a general search
      //(in case the user searches something like the "It" clown movie)
      response = await (
        await fetch(
          `https://www.omdbapi.com/?apikey=420fa557&t=${query}&type=movie&page=1`,
        )
      ).json();

      console.log('response2', response)

      //If still false, return the error message from the API
      if (response.Response == "False") {
        setErrorMessage(response.Error)
        setValid(false)
        setLoading(false)
        return;
      }


      //If second response didn't return false, set results to the returned movie (Will only be one, as we searched for a specific title)
      setResults([response]);
      setLoading(false)
      return;
    }


    //Will set first 8 movies to state if data is returned
    console.log(response.slice(0, 8))
    setResults(response.slice(0, 8));
    setLoading(false)

    return response;
  }
};

