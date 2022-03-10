import axios from "axios";

//Sort results displayed to users
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


//Fetch user watchlist, render items and handle errors
export const fetchWatchlist = async (setLoading, setErrorMessage, setFullResults, setMyWatchlist ) => {
  setLoading(true);
  const response = await axios
    .get("https://watchlist-server1.herokuapp.com/my-list", { withCredentials: true })
    .catch((err) => {
      console.log(err);
      setErrorMessage("Please Login to view your list!");
      return;
    });

  setLoading(false);

  setFullResults(response.data);
  setMyWatchlist(response.data);

  if (response.data.length === 0) {
    setErrorMessage(
      "You don't have any items in your watchlist. Add some in the discover tab!",
    );
  }
};



//Will populate media search while results are being fetched
export const skeleton = [
  {
    skeleton: true,
    title: "",
    tmdb_id: 1,
    type: "",
    poster_path: "",
    backdrop_path: "",
    release_date: "",
    tmdb_rating: "",
    my_rating: "",
    watched: "",
    liked: "",
  },
  {
    skeleton: true,
    title: "",
    tmdb_id: 2,
    type: "",
    poster_path: "",
    backdrop_path: "",
    release_date: "",
    tmdb_rating: "",
    my_rating: "",
    watched: "",
    liked: "",
  },
  {
    skeleton: true,
    title: "",
    tmdb_id: 3,
    type: "",
    poster_path: "",
    backdrop_path: "",
    release_date: "",
    tmdb_rating: "",
    my_rating: "",
    watched: "",
    liked: "",
  },
  {
    skeleton: true,
    title: "",
    tmdb_id: 4,
    type: "",
    poster_path: "",
    backdrop_path: "",
    release_date: "",
    tmdb_rating: "",
    my_rating: "",
    watched: "",
    liked: "",
  },
  {
    skeleton: true,
    title: "",
    tmdb_id: 5,
    type: "",
    poster_path: "",
    backdrop_path: "",
    release_date: "",
    tmdb_rating: "",
    my_rating: "",
    watched: "",
    liked: "",
  },
  {
    skeleton: true,
    title: "",
    tmdb_id: 6,
    type: "",
    poster_path: "",
    backdrop_path: "",
    release_date: "",
    tmdb_rating: "",
    my_rating: "",
    watched: "",
    liked: "",
  },
];