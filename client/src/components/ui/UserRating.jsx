import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import classes from "./UserRating.module.css";

export default function UserRating({ frontendRating, setFrontendRating, frontendWatched, setFrontendWatched  }) {
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if(!frontendWatched && frontendRating > 0) {
      setFrontendWatched(true);
    }

  }, [frontendRating])

  return (
    <div className={classes.starWrapper}>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        console.log(ratingValue);

        return (
          <label>
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
              onClick={() => setFrontendRating(ratingValue)}
            />
          </label>
        );
      })}
    </div>
  );
}
