import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import classes from './WatchedIcon.module.css'

const WatchedIcon = ({ frontendWatched, setFrontendWatched, frontendRating, setFrontendRating }) => {

  const watchedHandler = () => {
    if (frontendRating && frontendWatched) {
      setFrontendRating(0)
      setFrontendWatched(!frontendWatched)
    }
    setFrontendWatched(!frontendWatched)
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
          onClick={() => setFrontendWatched((prev) => !prev)}
          className={classes.notWatched}
        />
      )}
    </div>
  );
};

export default WatchedIcon;
