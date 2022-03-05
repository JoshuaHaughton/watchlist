import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import React, { useState } from "react";
import classes from './UserLike.module.css'

const UserLike = (props) => {
  const [clientLike, setClientLike] = useState(props.liked);
  console.log(props.liked);
  return (
    <div>
      {clientLike ? (
        <FontAwesomeIcon
          icon="heart"
          onClick={() => setClientLike((prev) => !prev)}
          className={classes.liked}
        />
      ) : (
        <FontAwesomeIcon
          icon={faHeart}
          onClick={() => setClientLike((prev) => !prev)}
          className={classes.notLiked}
        />
      )}
    </div>
  );
};

export default UserLike;
