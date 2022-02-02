import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDetails } from "../helpers/MediaInfoHelpers.js";
import Media from "../ui/Media";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";

const MediaInfo = ({ media }) => {
  let location = useLocation().pathname;
  let param = location.split("/");
  let id = param[param.length - 1];
 

  const [myMedia, setMyMedia] = useState(media || "");
  const [relatedMedia, setRelatedMedia] = useState("");
  const navigate = useNavigate();

  let src = media ? media.Poster : myMedia.Poster
  if (src === 'N/A') src = placeholder;

  //Get details for page everytime it is changed
  useEffect(() => {
    getDetails(id, navigate, setMyMedia, setRelatedMedia);
  }, [location]);

  // media ? media.Poster : myMedia.Poster

  return (
    <div id="media__body">
      <main id="media__main">
        <div className="media__container">
          <div className="row">
            <div className="media__selected--top">
              <Link to="/search" className="red click">
                <FontAwesomeIcon icon="arrow-left" />
              </Link>
              <Link to="/search" className="media__link click">
                <h3 className="media__selected--title--top red">
                  Back to Search
                </h3>
              </Link>
            </div>
            <div className="media__selected">
              <figure className="media__selected--figure">
                <img
                  src={src}
                  alt=""
                  className="media__selected--img"
                />
              </figure>
              <div className="media__selected--description">
                <h2 className="media__selected--title">
                  {myMedia.Title} - {myMedia.Year}
                </h2>
                <h3 className="media__summary--title">
                  Rating: {myMedia.imdbRating}
                </h3>
                <h3 className="media__summary--title">
                  Rated: {myMedia.Rated}
                </h3>
                <h3 className="media__summary--title">
                  Genres: {myMedia.Genre}
                </h3>
                <br />
                <h3 className="media__summary--title">Actors: </h3>
                <p className="media__summary--para">{myMedia.Actors}</p>
                <div className="media__summary">
                  <h3 className="media__summary--title">Summary</h3>
                  <p className="media__summary--para">{myMedia.Plot}</p>
                </div>
                {
                  <a href={`https://m.imdb.com/title/${id}/`} target="_blank">
                    {" "}
                    <button className="btn btn__effect">More Details</button>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>

        {relatedMedia.length > 0 ? (
          <div className="media__container">
            <div className="row">
              <div className="media__selected--top">
                <h2 className="media__selected--title--top black">
                  You may also like:
                </h2>
              </div>
              <div className="media">
                {relatedMedia &&
                  relatedMedia.slice(0, 4).map((media) => {
                    return (
                      <Media
                        media={media}
                        key={media.imdbId}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <h2 className="spacer">{"Sorry, no related media for this title"}</h2>
        )}
      </main>
    </div>
  );
};

export default MediaInfo;
