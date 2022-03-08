import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import classes from './WatchedIcon.module.css'
import { useCookies } from "react-cookie";
import axios from "axios";

const WatchedIcon = (props) => {
  const [cookies] = useCookies();
  const { frontendWatched, setFrontendWatched, frontendRating, setFrontendRating, mediaId } = props;

  const watchedHandler = async () => {
    //If user unwatches an item with a rating, remove the rating
    if (frontendRating > 0 && frontendWatched) {
      setFrontendRating(0)
    }

    //Set to opposite of what it was before
    setFrontendWatched(!frontendWatched)

    
    console.log('id for watch', mediaId);
    console.log('setting watch');

    const response = await axios.put('http://localhost:3001/user-watched', {frontendWatched: !frontendWatched, email: cookies.Email, mediaId}, {withCredentials: true});
    console.log(response);
    console.log(response.data);
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
