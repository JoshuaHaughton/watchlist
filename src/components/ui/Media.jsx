import React from "react";
import { Link } from "react-router-dom";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";
import { typeFormat, yearFormat } from "../helpers/MediaHelpers";

const Media = ({ media }) => {
  return (
    <div className="media__card">
      <Link to={`/media/${media.imdbID}`}>
        <div className="media__wrapper">
          <figure className="media__card--wrapper">
            <img
              src={media.Poster === "N/A" ? placeholder : media.Poster}
              alt=""
              className="media__card--img"
            />
          </figure>
          <div className="media__description">
            <h3 className="media__title">{media.Title}</h3>
            <h5 className="media__type">{typeFormat(media.Type)}</h5>
            <h5 className="media__year">{yearFormat(media.Year)}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Media;
