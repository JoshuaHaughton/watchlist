import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import classes from "./UserRating.module.css";

export default function UserRating({ frontendRating, setFrontendRating, frontendWatched, setFrontendWatched, mediaId  }) {
  const [hover, setHover] = useState(null);
  const [cookies] = useCookies()
  const isMounted = useRef(false);
  console.log(cookies);

  const setRating = async (ratingValue) => {
    console.log(ratingValue);
    setFrontendRating(ratingValue)
    console.log('id for like', mediaId);
    const response = await axios.put('http://localhost:3001/user-rating', {frontendRating: ratingValue, email: cookies.Email, mediaId});
    console.log(response);
    console.log(response.data);
  }

  useEffect(() => {
    if(!frontendWatched && frontendRating > 0) {
      setFrontendWatched(true);
    }
    console.log('first load?', !isMounted.current);

    //If it is automaticaly cancelled out by user unchecking watched (Because if they haven't watched it, they can't rate it) then set backend to match
    if(frontendRating === 0 && isMounted.current) {
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
        // console.log(ratingValue);

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
              className={classes.star}
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
