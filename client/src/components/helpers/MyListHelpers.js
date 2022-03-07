export const sortMyListResults = (filter, setMyWatchlist, setFilterType, fullResults) => {
  //Visually changes value of filter for user
  setFilterType(filter);

  if (filter === "ALL") {
    setMyWatchlist(fullResults);
  }

  if (filter === "MOVIES") {
    setMyWatchlist(fullResults.slice().filter((a) => {
      return a.type === 'movie'
    }));
  }

  if (filter === "TV") {
    setMyWatchlist(fullResults.slice().filter((a) => {
      return a.type === 'tv'
    }));
  }

  if (filter === "DATE") {
    setMyWatchlist(fullResults.slice().sort((a, b) => {
      let aTime = a.release_date || a.first_air_date
      let bTime = b.release_date || b.first_air_date
      return new Date(aTime).getTime() - new Date(bTime).getTime()
    }));
  }

  if (filter === "NAME") {
    setMyWatchlist(
      fullResults.slice().sort((a, b) => {
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
