import tmdbApi from "../../../api/tmdbApi";

export const sortResults = (filter, results, setResults, setSortValue) => {
  //Visually changes value of filter for user
  setSortValue(filter);

  if (filter === "OLDEST") {
    setResults(results.slice().sort((a, b) => {
      let aTime = a.release_date || a.first_air_date
      let bTime = b.release_date || b.first_air_date
      return new Date(aTime).getTime() - new Date(bTime).getTime()
    }));
  }

  if (filter === "NEWEST") {
    setResults(results.slice().sort((a, b) => {
      let aTime = a.release_date || a.first_air_date
      let bTime = b.release_date || b.first_air_date
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    }));
  }

  if (filter === "TITLE") {
    setResults(
      results.slice().sort((a, b) => {
        let aTitle = a.title || a.name;
        let bTitle = b.title || b.name;
        return aTitle.localeCompare(bTitle, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      }),
    );
  }
};



//Returns list of movies from tmdbApi for given query
export const fetchQueryData = async (query, setResults, setLoading, setSearchComplete) => {

  if (query !== "") {
    setSearchComplete(false)


    let response = await tmdbApi.search(query);


    //Filters out actors from the search of movies and tv series
    response = await response.results.filter(result => {
      return result.media_type !== 'person'
    })

    console.log("response", response)

    console.log(response.slice(0, 9))
    //Will set first 8 movies to state if data is returned
    setResults(response.slice(0, 9));
    setLoading(false)
    setSearchComplete(true)

    return response;
  }
};


//Will populate media search while results are being fetched
export const skeletonArr = [
  {
    id: 1,
    title: "-",
    media_type: "-",
    release_date: "-",
    skeleton: true,
  },
  {
    id: 2,
    title: "-",
    media_type: "-",
    release_date: "-",
    skeleton: true,
  },
  {
    id: 3,
    title: "-",
    media_type: "-",
    release_date: "-",
    skeleton: true,
  },
  {
    id: 4,
    title: "-",
    media_type: "-",
    release_date: "-",
    skeleton: true,
  },
];