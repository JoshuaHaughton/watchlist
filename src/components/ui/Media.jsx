import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";
import { typeFormat, yearFormat } from "../helpers/MediaHelpers";
import skeleton from "../../assets/GrayBG.jpeg"
import { apiConfig } from "../../api/axiosClient";

const Media = ({ media }) => {
  let classType;
  media.id ? classType = 'media' : classType = 'skeleton'
  let year 

  if (!media.release_date && !media.first_air_date) {
    year = 'N/A'
  } else if (media.release_date) {
    year = media.release_date
  } else if (media.first_air_date) {
    year = media.first_air_date
  }
  
  
  // if (media.release_date !== '-' &&) && (media.release_date ? yearFormat(media.release_date) : yearFormat(media.first_air_date))

  //base image path for tmdb

  let imagePath;

  if (media.poster_path) {
    imagePath = apiConfig.w500Image(media.poster_path)
  } else if (media.backdrop_path) {
    imagePath = apiConfig.w500Image(media.backdrop_path)
  } else {
    imagePath = placeholder;
  }

  console.log(imagePath, 'PATH');
  console.log(media, 'media');

  
  return (
    <div className="media__card">
      <Link to={`/${media.media_type}/${media.id}`}>
      {/* <Link to={media.imdbID ? `/media/${media.imdbID}` : ''}> */}
        <div className="media__wrapper">
          <figure className={`${classType}__card--wrapper`}>
            <img
              src={imagePath}
              alt={media.title ? media.title : media.name}
              className={`${classType}__card--img`}
            />
          </figure>
          <div className="media__description">
            <h3 className={`${classType}__title`}>{media.title || media.name}</h3>
            {/* <h5 className={`${classType}__type`}>{typeFormat(media.media_type)}</h5> */}
            <h5 className={`${classType}__year`}>{typeFormat(year)}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Media;
