import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDetails } from "../helpers/MediaInfoHelpers.js";
import Media from "../ui/Media";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";
import { apiConfig } from "../../api/axiosClient.js";
import Rating from "../ui/Rating.jsx";

const MediaInfo = ({ media }) => {
  console.log(media);
  // const { media = lo } = useLocation();
  // console.log(lo);
  let location = useLocation().pathname;
  let param = location.split("/");
  let id = param[param.length - 1];
  let category = param[param.length - 2];
 

  //Movie info of current page
  const [myMedia, setMyMedia] = useState(media || {
    title: '',
    release_date: null,
    vote_average: 0,
    genres: [{id: null, name: ''}]
  });

  //State for related media section below the movie info
  const [relatedMedia, setRelatedMedia] = useState("");
  const navigate = useNavigate();

  //If media was passed in, automatically use the src of that object. Else, wait until state returns and use that src instead
  // let src = media ? (media.poster_path || media.backdrop_path || placeholder) : (myMedia.poster_path || myMedia.backdrop_path || placeholder)
  // //f that specific movie doesn't have an image, use a placeholder to let user know
  // if (src === 'N/A') src = placeholder;

  //Get details for page everytime it is changed
  useEffect(() => {
    getDetails(id, category, navigate, setMyMedia, setRelatedMedia);
  }, [location]);

  
  console.log(myMedia, 'test');
  const title = myMedia.title || myMedia.name;
  const year = myMedia.release_date || myMedia.first_air_date;
  const rating = myMedia.vote_average
  const genre = myMedia.genres
  const summary = myMedia.overview
  let src = placeholder
  let imdbId = myMedia.imdb_id

  let selectedClass = "media__selected skeleton"

  if (myMedia && !myMedia.poster_path && !myMedia.backdrop_path) {
    selectedClass = "media__selected"
    src = placeholder;
  } else if (myMedia.poster_path) {
    selectedClass = "media__selected"
    src = apiConfig.w500Image(myMedia.poster_path)
  } else if(myMedia.backdrop_path) {
    selectedClass = "media__selected"
    src = apiConfig.w500Image(myMedia.backdrop_path)
  }

  


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
                  {title}
                </h2>
                <h3 className="media__summary--title">
                  Year: {year && year.slice(0, 4)}
                </h3>
                <h3 className="media__summary--title">
                  Rating: {rating}
                </h3>
                <Rating rating={rating} />
                <br />
                {/* <h3 className="media__summary--title">
                  Rated: {myMedia.Rated}
                </h3> */}
                <h3 className="media__summary--title">
                  Genres: {genre.map((g, idx) => (idx !== genre.length - 1) ? `${g.name}, ` : `${g.name}`)}
                </h3>
                <br />
                {/* <h3 className="media__summary--title">Actors: </h3>
                <p className="media__summary--para">{myMedia.Actors}</p> */}
                <div className="media__summary">
                  <h3 className="media__summary--title">Summary</h3>
                  <p className="media__summary--para">{summary}</p>
                </div>
                {myMedia.homepage &&
                  <a href={myMedia.homepage} target="_blank">
                    {" "}
                    <button className="btn btn__effect">More Details</button>
                  </a>
                }
                {(imdbId && !myMedia.homepage) &&
                  <a href={`https://m.imdb.com/title/${imdbId}/`} target="_blank">
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
                        key={media.id}
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
