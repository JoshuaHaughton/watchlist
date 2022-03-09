import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/auth-context";
import { fetchWatchlist, sortMyListResults } from "./MyListHelpers";
import WatchlistItem from "../../ui/WatchlistItem/WatchlistItem";
import classes from "./MyList.module.css";
import { skeleton } from "./MyListHelpers";

const MyList = () => {
  const [filterType, setFilterType] = useState("all");
  const [fullResults, setFullResults] = useState(null);
  const [myWatchlist, setMyWatchlist] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();


  const navigateBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    let timeout = null;

    //On first load and when logged state changes, fetch user watchlist if they are logged in
    if (!isLoggedIn) {
      //Give time to fetch data before rendering error
      timeout = setTimeout(() => {
        setErrorMessage("Please Login to view your list!");
      }, 300);

    } else {
      //If logged in, set error to false and fetch watchlist
      setErrorMessage(false);
      fetchWatchlist(setLoading, setErrorMessage, setFullResults, setMyWatchlist);
    }

    //If logged state changes to true before setTimeout ends, cancel setTimeout
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
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
                      onChange={(e) =>
                        sortMyListResults(
                          e.target.value,
                          setMyWatchlist,
                          setFilterType,
                          fullResults,
                        )
                      }
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

              <div className={classes.mediaContent}>
                {myWatchlist.length > 0 &&
                  !loading &&
                  myWatchlist.map((media) => {
                    console.log("item");
                    return (
                      <WatchlistItem
                        media={media}
                        key={media.tmdb_id}
                        reloadWatchlist={setMyWatchlist}
                      />
                    );
                  })}

                {!fullResults &&
                  loading &&
                  skeleton.map((item) => {
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
