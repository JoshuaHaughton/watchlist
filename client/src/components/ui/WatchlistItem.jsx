import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";
import { typeFormat } from "../helpers/MediaHelpers";
import skeleton from "../../assets/GrayBG.jpeg"
import { apiConfig } from "../../api/axiosClient";
import Rating from "./Rating";
import classes from './WatchlistItem.module.css'
import UserRating from "./UserRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import UserLike from "./UserLike";
import WatchedIcon from "./WatchedIcon";
import { set } from "lodash";


const WatchlistItem = (props) => {
  const { media } = props;
  const [frontendRating, setFrontendRating] = useState(media.my_rating)
  const [frontendWatched, setFrontendWatched] = useState(media.watched)
  console.log(media, 'media');

  //Deside class based on if the media given was a skeleton or not (for loading state)
  let classType;
  media.tmdb_id ? classType = 'media' : classType = 'skeleton'

  //Format year based on if media is a tv series or a movie
  let year ;

  if (!media.release_date && !media.first_air_date) {
    year = 'N/A'
  } else if (media.release_date) {
    year = media.release_date;
  } else if (media.first_air_date) {
    year = media.first_air_date;
  }
  
  //Format image path based on what images are available
  let imagePath;

  if (media.backdrop_path) {
    imagePath = apiConfig.w500Image(media.backdrop_path)
  } else if (media.poster_path) {
    imagePath = apiConfig.w500Image(media.poster_path)
  } else if (media.skeleton) {
    //Blank background for loading state
    imagePath = skeleton;
  } else {
    //"No image available" placeholder
    imagePath = placeholder;
  }

  useEffect(() => {
    if(frontendWatched)
    if (frontendRating && !frontendWatched) {
      setFrontendWatched(true)
    }

  }, [frontendWatched, frontendRating])

  
  return (
    <div className={classes.card}>
      <Link to={`/${media.type}/${media.tmdb_id}`}>
        <div className={classes.mediaWrapper}>
          <figure className={classes[`${classType}ImgWrapper`]}>
            <img
              src={imagePath ? imagePath : skeleton}
              alt={media.title}
              className={classes[`${classType}CardImg`]}
            />
          <div className={classes.mediaWrapperBg}></div>
          </figure>
          {!media.skeleton && 
          <div className={classes.hoverDetails}>
            <h3 className={classes[`${classType}Title`]}>{media.title || media.name}</h3>
            <h5 className={classes[`${classType}Year`]}>{media.release_date}</h5>
            {(media && media.tmdb_rating) > 0 ? <Rating rating={media.tmdb_rating} /> : <p>No Ratings<br /></p>}
            <br />
            <h3 className={`${classType}Title`}>{typeFormat(media.type)}</h3>
          </div>
          }
        </div>
      </Link>

      <div className={classes.description}>
        <h3 className={classes.mediaTitles}>{media.title}</h3>
        <div className={classes.mediaParagraph}>My rating: <UserRating frontendRating={frontendRating} setFrontendRating={setFrontendRating} frontendWatched={frontendWatched} setFrontendWatched={setFrontendWatched} mediaId={media.tmdb_id}/></div>
        <div className={`${classes.mediaParagraph} ${classes.watchedIcon}`}>Watched: <WatchedIcon frontendWatched={frontendWatched} setFrontendWatched={setFrontendWatched} frontendRating={frontendRating} setFrontendRating={setFrontendRating} mediaId={media.tmdb_id}/> </div>
        <br />

        <div className={classes.descriptionBottomRow}>
          <p className={classes.mediaParagraph}>{typeFormat(media.type)}</p>
          <div className={classes.userActions}>
            <UserLike liked={media.liked}/>
            <FontAwesomeIcon icon={faTrashCan} className={`${classes.actionIcon} ${classes.deleteIcon}`}/>
          </div>
        </div>

      </div>




    </div>
  );
};

export default WatchlistItem;
