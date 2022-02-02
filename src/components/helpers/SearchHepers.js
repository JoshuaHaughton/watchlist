export const sortResults = (filter, results, setResults, setSortValue) => {
  //Visually changes value of filter for user
  setSortValue(filter);

  if (filter === "OLDEST") {
    setResults(results.slice().sort((a, b) => a.Year - b.Year));
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
export const fetchQueryData = async (query, setResults, setTooBroad) => {

  if (query !== "") {
    let response = await (
      await fetch(
        `https://www.omdbapi.com/?apikey=420fa557&s=${query}&type=movie&page=1`,
      )
    ).json();


    if (response.Response === "False") {
      //This error happens because too many results come back... search is too broad
      //Searches for the given query as a title instead of a general search
      //(in case the user searches something like the "It" clown movie)
      response = await (
        await fetch(
          `https://www.omdbapi.com/?apikey=420fa557&t=${query}&type=movie&page=1`,
        )
      ).json();


      if (!response) {
        //Results are too broad, let user know
        setTooBroad(true)
        return;
      }
      setTooBroad(false);


      setResults([response]);
      return;
    }

    setResults(response.Search.slice(0, 8));

    return response.Search;
  }
};

