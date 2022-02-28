import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";
import { typeFormat } from "../helpers/MediaHelpers";
import skeleton from "../../assets/GrayBG.jpeg"
import { apiConfig } from "../../api/axiosClient";

const Media = ({ media }) => {

  //Deside class based on if the media given was a skeleton or not (for loading state)
  let classType;
  media.id ? classType = 'media' : classType = 'skeleton'

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

  if (media.poster_path) {
    imagePath = apiConfig.w500Image(media.poster_path)
  } else if (media.backdrop_path) {
    imagePath = apiConfig.w500Image(media.backdrop_path)
  } else if (media.skeleton) {
    //Blank background for loading state
    imagePath = skeleton;
  } else {
    //"No image available" placeholder
    imagePath = placeholder;
  }

  
  return (
    <div className="media__card">
      <Link to={`/${media.media_type}/${media.id}`}>
        <div className="media__wrapper">
          <figure className={`${classType}__card--wrapper`}>
            <img
              src={imagePath ? imagePath : skeleton}
              alt={media.title ? media.title : media.name}
              className={`${classType}__card--img`}
            />
          </figure>
          <div className="media__description">
            <h3 className={`${classType}__title`}>{media.title || media.name}</h3>
            <h5 className={`${classType}__year`}>{typeFormat(year)}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Media;
