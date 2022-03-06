import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import React, { useState } from "react";
import classes from './UserLike.module.css'
import axios from "axios";
import { useCookies } from "react-cookie";

const UserLike = ({ liked, mediaId }) => {
  const [frontendLike, setFrontendLike] = useState(liked);
  const [cookies] = useCookies()

  const handleLike = async () => {
    setFrontendLike(!frontendLike);

    console.log('id for like', mediaId);
    console.log('setting backend like');

    const response = await axios.put('http://localhost:3001/user-liked', {frontendLike: !frontendLike, email: cookies.Email, mediaId}, {withCredentials: true});
    console.log(response);
    console.log(response.data);
  }


  return (
    <div>
      {frontendLike ? (
        <FontAwesomeIcon
          icon="heart"
          onClick={handleLike}
          className={classes.liked}
        />
      ) : (
        <FontAwesomeIcon
          icon={faHeart}
          onClick={handleLike}
          className={classes.notLiked}
        />
      )}
    </div>
  );
};

export default UserLike;
