import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";
import { typeFormat, yearFormat } from "../helpers/MediaHelpers";
import skeleton from "../../assets/GrayBG.jpeg"

const Media = ({ media }) => {
  let classType;
  media.imdbID ? classType = 'media' : classType = 'skeleton'
  return (
    <div className="media__card">
      <Link to={media.imdbID ? `/media/${media.imdbID}` : ''}>
        <div className="media__wrapper">
          <figure className={`${classType}__card--wrapper`}>
            <img
              src={media.Poster ? (media.Poster === "N/A" ? placeholder : media.Poster) : skeleton}
              alt=""
              className={`${classType}__card--img`}
            />
          </figure>
          <div className="media__description">
            <h3 className={`${classType}__title`}>{media.Title}</h3>
            <h5 className={`${classType}__type`}>{typeFormat(media.Type)}</h5>
            <h5 className={`${classType}__year`}>{yearFormat(media.Year)}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Media;
