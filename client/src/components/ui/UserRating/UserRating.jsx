import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import classes from "./UserRating.module.css";

export default function UserRating(props) {
  const [hover, setHover] = useState(null);
  const isMounted = useRef(false);
  const { frontendRating, setFrontendRating, mediaId  } = props;

  const setRating = async (ratingValue) => {
    setFrontendRating(ratingValue)
    await axios.put('https://watchlist-server1.herokuapp.com/user-rating', {frontendRating: ratingValue, mediaId}, {withCredentials: true});
  }

  useEffect(() => {
    //If it is automaticaly cancelled out by user unchecking watched (Because if they haven't watched it, they can't rate it) then set backend to match
    if(frontendRating === 0 && isMounted.current) {
      //Only run condition when frontendRating changes due to watched icon being toggled (not on first load)
      setRating(frontendRating)
    }

    //Change to true after first render
    if (!isMounted.current) {
      isMounted.current = true
    }

  }, [frontendRating])

  return (
    <div className={classes.starWrapper}>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

        return (
          <label key={i}>
            <input
              className={classes.input}
              type="radio"
              name="rating"
              value={ratingValue}
              
            />
            <FontAwesomeIcon
              icon="star"
              key={i}
              color={ratingValue <= (hover || frontendRating) ? `#c78f03` : "#ba181b"}
              className={props.skeleton ? classes.skeleton : classes.star}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(ratingValue)}
            />
          </label>
        );
      })}
    </div>
  );
}
