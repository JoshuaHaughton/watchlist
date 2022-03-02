import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDetails } from "../helpers/MediaInfoHelpers.js";
import Media from "../ui/Media";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";
import { apiConfig } from "../../api/axiosClient.js";
import Rating from "../ui/Rating.jsx";
import Actor from "../ui/Actor.jsx";
import DarkBg from '../../assets/GrayBG2.jpeg'

const MediaInfo = ({ media }) => {
  //Get media category and id from url path
  let location = useLocation().pathname;
  let param = location.split("/");
  let id = param[param.length - 1];
  let category = param[param.length - 2];
  const navigate = useNavigate();
 

  //Movie info of current page
  const [myMedia, setMyMedia] = useState(media || {
    title: '',
    release_date: null,
    vote_average: 0,
    genres: [{id: null, name: ''}]
  });

  //State for related media section below the movie info
  const [relatedMedia, setRelatedMedia] = useState("");
  const [cast, setCast] = useState([])

  //Get details for page everytime the url is changed
  useEffect(() => {
    getDetails(id, category, setMyMedia, setRelatedMedia, setCast);
    
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

  //Navigate to the previous page
  const navigateBack = () => {
    navigate(-1);
  }




  return (
    <div id="media__body">
      {/* <main id="media__main"> */}
        <div id="media__container">
          <div className="container__fade">

          <div className="row">
            <div className="media__selected--top">
                <FontAwesomeIcon icon="arrow-left" className="white click" onClick={navigateBack}/>
                <h3 className="media__selected--title--top white click" onClick={navigateBack}>
                  Previous Page
                </h3>
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


                {year ? <h3 className="media__summary--title">
                  Year: {year && year.slice(0, 4)}
                </h3>
                :
                <h3 className="media__summary--title red">
                  Year Not Listed by Api
                </h3>
                }

                {rating > 0 ?
                <h3 className="media__summary--title">
                  Rating: <div className="media__score">{rating}</div>
                </h3>
                :
                <h3 className="media__summary--title red">
                  No Rating Available
                </h3>
                }

                {rating > 0 && <Rating rating={rating} />}

                

                {rating > 0 && <br />}

               {
               genre.length > 0 ?  
                <h3 className="media__summary--title">
                  Genres: {genre.map((g, idx) => (idx !== genre.length - 1) ? `${g.name}, ` : `${g.name}`)}
                </h3>
                :
                <h3 className="media__summary--title red">
                  No Genres Listed
                </h3>
                }


                <br />


                {summary ? 
                <div className="media__summary">
                  <h3 className="media__summary--title">Summary</h3>
                  <p className="media__summary--para">{summary}</p>
                </div>
                :
                <div className="media__summary">
                  <h3 className="media__summary--title red">No Summary Available</h3>
                </div>
                }

                {/* Button to movie homepage if there is one */}
                {myMedia.homepage &&
                  <a href={myMedia.homepage} target="_blank">
                    {" "}
                    <button className="btn btn__effect">More Details</button>
                  </a>
                }
                {/* Button to movie imdb page if there isn't a homepage */}
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
        </div>


        {/* CAST */}


        {cast.length > 0 ? <div className="cast__container">
          <div className="cast__container--fade">
            <div className="row">
            {/* <div className="row bgblack"> */}
              <div className="cast__section">
                <h2 className="gold">Cast</h2>
                <div className="cast__wrapper">
                  {cast && cast.map(actor => {
                    return <Actor
                    key={actor.id}
                    id={actor.id}
                    name={actor.name}
                    character={actor.character}
                    src={actor.profile_path ? apiConfig.w500Image(actor.profile_path) : placeholder} 
                    />
                  })}
                </div>
              </div>
            {/* </div> */}
            </div>
          </div>
        </div>
        :
        <div className="cast__container--alt">
          <div className="cast__container--fade">
              <h2 className="cast__title--alt red">{"Sorry, no Cast listed for this title via Api"}</h2>
          </div>
        </div>
        }

          
          


        {/* Suggested */}

        {relatedMedia.length > 0 ? (
          <div className="suggested__container bgblack">
            <div className="row">
              <div className="media__selected--top">
                <h2 className="media__selected--title--top gold">
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
                        suggested={true}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <h2 className="related__title red bgblack">{"Sorry, no related media for this title"}</h2>
        )}
      {/* </main> */}
    </div>
  );
};

export default MediaInfo;
