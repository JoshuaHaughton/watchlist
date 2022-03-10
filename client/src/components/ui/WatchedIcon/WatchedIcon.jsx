import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import classes from './WatchedIcon.module.css'
import axios from "axios";

const WatchedIcon = (props) => {
  const { frontendWatched, setFrontendWatched, frontendRating, setFrontendRating, mediaId } = props;

  const watchedHandler = async () => {
    //If user unwatches an item with a rating, remove the rating
    if (frontendRating > 0 && frontendWatched) {
      setFrontendRating(0)
    }

    //Value that watched will be changed to 
    const currentWatchedValue = !frontendWatched;

    //Set to opposite of what it was before. used !prev before, but frontend and backend would sometimes be different
    setFrontendWatched(prev => currentWatchedValue)

    //Change backend "watched" boolean
    await axios.put('https://watchlist-server1.herokuapp.com/user-watched', {frontendWatched: currentWatchedValue, mediaId}, {withCredentials: true});
  }


  return (
    <div className={classes.watchedIcon}>
      {frontendWatched ? (
        <FontAwesomeIcon
          icon={faCheck}
          onClick={watchedHandler}
          className={classes.watched}
        />
      ) : (
        <FontAwesomeIcon
          icon={faTimes}
          onClick={watchedHandler}
          className={props.skeleton ? classes.skeleton : classes.notWatched}
        />
      )}
    </div>
  );
};

export default WatchedIcon;
