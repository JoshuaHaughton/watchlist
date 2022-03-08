import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/auth-context";
import { sortMyListResults } from "../../helpers/MyListHelpers";
import WatchlistItem from "../../ui/WatchlistItem/WatchlistItem";
import classes from './MyList.module.css'

const MyList = (props) => {
  const [cookies] = useCookies();
  const [filterType, setFilterType] = useState("all");
  const [fullResults, setFullResults] = useState(null);
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

  const fetchWatchlist = async () => {
    console.log("posting");
    console.log(cookies);
    setLoading(true);
    const response = await axios
      .get("http://localhost:3001/my-list", { withCredentials: true })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Please Login to view your list!");
        return;
      });

    // const formattedWatchlist = response.data
    console.log(response.data[0]);
    setLoading(false);

    setFullResults(response.data)
    setMyWatchlist(response.data);
    console.log("Actual response from DB", response.data);
    console.log("watchlist: (may be delayed)", myWatchlist);

    // setErrorMessage("Please Login to view your list!");
    if (response.data.length === 0) {
      setErrorMessage("You don't have any items in your watchlist. Add some in the discover tab!")
    }

  };


  useEffect(() => {
    fetchWatchlist();
  }, []);

  useEffect(() => {
    let timeout = null;
    if (!isLoggedIn) {
      timeout = setTimeout(() => {
        setErrorMessage("Please Login to view your list!");
      }, 300)
    } else {
      setErrorMessage(false);
      fetchWatchlist();
    }

    return(() => {
      if(timeout) {
        clearTimeout(timeout);
      }
    })
  }, [isLoggedIn]);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div>
          {errorMessage ? (
            <h1 className={classes.errorPage}>{errorMessage}</h1>
          ) : (
            <>
              <div className={classes.pageDescription}>
                <div className={classes.descriptionTopRow}>
                  <div className={classes.iconWrapper}>
                    <FontAwesomeIcon
                      icon="arrow-left"
                      className={classes.backArrow}
                      onClick={navigateBack}
                    />
                  </div>

                  <h1 className={classes.pageTitle}>My List</h1>

                  <div className={classes.selectWrapper}>
                    <select
                    className={classes.select}
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

                <p className={classes.white}>
                  Browse items from your saved watchlist!
                </p>

                <hr />
              </div>




              {/* <div className="my-list__header">
                <h1 className="my-list__title">My List</h1>
                <p className="my-list__text white">Browse your list</p>
              </div> */}






              <div className={classes.mediaContent}>
                {myWatchlist.length > 0 && !loading
                  && myWatchlist.map((media) => {
                      console.log("item");
                      return (
                        <WatchlistItem
                          media={media}
                          key={media.tmdb_id}
                          reloadWatchlist={setMyWatchlist}
                        />
                      );
                    })
                  }
                  
                  {(!fullResults && loading) && skeleton.map((item) => {
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
