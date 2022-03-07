import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/auth-context";
import { sortMyListResults } from "../helpers/MyListHelpers";
import WatchlistItem from "../ui/WatchlistItem";

const MyList = (props) => {
  const [cookies] = useCookies();
  const [filterType, setFilterType] = useState("all");
  const [fullResults, setFullResults] = useState();
  const [myWatchlist, setMyWatchlist] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const skeleton = [
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

  const navigateBack = () => {
    navigate(-1);
  }


  useEffect(() => {
    const fetchWatchlist = async () => {
      console.log("posting");
      console.log(cookies);
      setLoading(true);
      const response = await axios
        .get("http://localhost:3001/my-list", { withCredentials: true })
        .catch((err) => {
          console.log(err.message);
          setErrorMessage("Please Login to view your list!");
        });

      // const formattedWatchlist = response.data
      console.log(response.data[0]);
      setLoading(false);
      setFullResults(response.data)
      setMyWatchlist(response.data);
      console.log("Actual response from DB", response.data);
      console.log("watchlist: (may be delayed)", myWatchlist);
    };

    fetchWatchlist();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setErrorMessage("Please Login to view your list!");
    } else {
      setErrorMessage(false);
    }
  }, [isLoggedIn]);

  return (
    <div className="my-list__container">
      <div className="row">
        <div className="my-list__content">
          {errorMessage ? (
            <h1 className="error-page">{errorMessage}</h1>
          ) : (
            <>
              <div className="page__description">
                <div className="discover__header--row">
                  <div className="discover__arrow--wrapper">
                    <FontAwesomeIcon
                      icon="arrow-left"
                      className="discover__arrow white click"
                      onClick={navigateBack}
                    />
                  </div>

                  <h1 className="page__header gold">My List</h1>

                  <div className="discover__filter--wrapper">
                    <select
                    className="discover__filter"
                    value={filterType}
                    onChange={(e) =>  sortMyListResults(
                      e.target.value,
                      setMyWatchlist,
                      setFilterType,
                      fullResults
                    )}
                  >
                    <option value="ALL">All</option>
                    <option value="MOVIES">Movies</option>
                    <option value="TV">Series</option>
                    <option value="NAME">All by Name</option>
                    <option value="DATE">All by Date</option>
                  </select>
                  </div>

                </div>

                <p className="white">
                  Browse items from your saved watchlist!
                </p>

                <hr />
              </div>




              {/* <div className="my-list__header">
                <h1 className="my-list__title">My List</h1>
                <p className="my-list__text white">Browse your list</p>
              </div> */}






              <div className="my-list__media--content">
                {myWatchlist.length > 0 && !loading
                  ? myWatchlist.map((media) => {
                      console.log("item");
                      return (
                        <WatchlistItem
                          media={media}
                          key={media.tmdb_id}
                          reloadWatchlist={setMyWatchlist}
                        />
                      );
                    })
                  : skeleton.map((item) => {
                      return (
                        <WatchlistItem
                          media={item}
                          key={item.tmdb_id}
                          reloadWatchlist={setMyWatchlist}
                        />
                      );
                    })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;
