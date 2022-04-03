import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../../../assets/No-Image-Placeholder.svg.png";
import { typeFormat } from "../../helpers/MediaHelpers";
import skeleton from "../../../assets/GrayBG.jpeg";
import { apiConfig } from "../../../api/axiosClient";
import Rating from "../Rating/Rating";
import classes from "./Media.module.css";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Media = (props) => {
  const { media, suggested } = props;
  const [img, setImg] = useState();


  //Deside class based on if the media given was a skeleton or not (for loading state)
  let classType;
  !media.skeleton ? (classType = "media") : (classType = "skeleton");

  //Format year based on if media is a tv series or a movie
  let year;

  if (!media.release_date && !media.first_air_date) {
    year = "N/A";
  } else if (media.release_date) {
    year = media.release_date;
  } else if (media.first_air_date) {
    year = media.first_air_date;
  }

  //Format image path based on what images are available
  let imagePath;

  if (media.poster_path) {
    imagePath = apiConfig.w500Image(media.poster_path);
  } else if (media.backdrop_path) {
    imagePath = apiConfig.w500Image(media.backdrop_path);
  } else if (media.skeleton) {
    //Blank background for loading state
    imagePath = skeleton;
  } else {
    //"No image available" placeholder
    imagePath = placeholder;
  }


  //Whole component doesn't re-render with useRef unlike useState
  const mountedRef = useRef(true);

  //Loads skeleton image in place of vinyls until they load
  useEffect(() => {
    let image = new Image();
    if (imagePath) {
      image.src = imagePath;

      image.onload = () => {
        if (imagePath) {
          setImg(image);
        }
      };
    }
    return () => {
      //when the component unmounts
      mountedRef.current = false;
    };
  }, [imagePath]);


  return (
    <div
      className={
        !suggested
          ? classes.mediaCard
          : `${classes.mediaCard} ${classes.suggestedCard}`
      }
    >
      <Link to={!media.skeleton ? `/${media.media_type}/${media.id}` : "#"}>
        <div className={classes.mediaWrapper}>
          <figure className={classes.mediaCardWrapper}>
            <img
              src={img ? img.src : skeleton}
              alt={media.title ? media.title : media.name}
              className={classes.mediaCardImg}
            />
            <div className={classes.mediaWrapperBg}></div>
          </figure>
          {!media.skeleton && (
            <div className={classes.mediaDescription}>
              <h3 className={classes[`${classType}Title`]}>
                {media.title || media.name}
              </h3>
              <h5 className={classes[`${classType}Year`]}>{year}</h5>
              {(media && media.vote_average) > 0 ? (
                <Rating rating={media.vote_average} />
              ) : (
                <p>
                  No Ratings
                  <br />
                </p>
              )}
              <br />
              <h3 className={classes[`${classType}Title`]}>
                {typeFormat(media.media_type)}
              </h3>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Media;
