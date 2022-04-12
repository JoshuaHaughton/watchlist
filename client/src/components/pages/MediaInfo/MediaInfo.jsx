import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addMediaToWatchlist, checkWatchlistForItem, getDetails } from "./MediaInfoHelpers.js";
import Media from "../../ui/Media/Media";
import placeholder from "../../../assets/No-Image-Placeholder.svg.png";
import { apiConfig } from "../../../api/axiosClient.js";
import Rating from "../../ui/Rating/Rating.jsx";
import Actor from "../../ui/Actor/Actor.jsx";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/auth-context.js";
import classes from './MediaInfo.module.css'

const MediaInfo = (props) => {
  const { isLoggedIn } = useAuth();
  //Get media category and id (movie or tv) from url path
  let location = useLocation().pathname;
  let param = location.split("/");
  let id = param[param.length - 1];
  let category = param[param.length - 2];

  const { media } = props;
  const navigate = useNavigate();

  //Movie info of current page
  const [d, setd] = useState(media || {
    title: '',
    release_date: null,
    vote_average: 0,
    genres: [{id: null, name: ''}]
  });

  //State for related media section below the movie info
  const [relatedMedia, setRelatedMedia] = useState("");
  const [cast, setCast] = useState([])
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  const [loading, setLoading] = useState(true)


  //Get details for page everytime the url is changed
  useEffect(() => {
    id = param[param.length - 1];
    category = param[param.length - 2];

    //Get details for media of current page
    getDetails(id, category, setd, setRelatedMedia, setCast);

    //Check user watchlist to see if this title has already been added
    checkWatchlistForItem(id, setLoading, setAddedToWatchlist)
    
  }, [location]);

  //Check if item is in user's watchlist when user logs in / out
  useEffect(() => {
    id = param[param.length - 1];
    category = param[param.length - 2];
    checkWatchlistForItem(id, setLoading, setAddedToWatchlist);
  }, [isLoggedIn])


  const title = d.title || d.name;
  const year = d.release_date || d.first_air_date;
  const rating = d.vote_average
  const genre = d.genres
  const summary = d.overview
  let src = placeholder
  let imdbId = d.imdb_id


  let backdrop_path = null;
    if (d.backdrop_path) {
      backdrop_path = d.backdrop_path;
    }

    //Formatted data for submission
  const savedData = {
    title, 
    id, 
    category, 
    poster_path: src, 
    backdrop_path, 
    rating, 
    year
  }


  let selectedClass = "media__selected skeleton"


  if (d && !d.poster_path && !d.backdrop_path) {
    selectedClass = "media__selected"
    src = placeholder;
  } else if (d.poster_path) {
    selectedClass = "media__selected"
    src = apiConfig.w500Image(d.poster_path)
  } else if(d.backdrop_path) {
    selectedClass = "media__selected"
    src = apiConfig.w500Image(d.backdrop_path)
  }

  //Navigate to the previous page
  const navigateBack = () => {
    navigate(-1);
  }


  return (
    <div className={classes.body}>
      {/* <main id="media__main"> */}
        <div id="media__container" className={classes.container}>
          <div className={classes.containerFade}>

          <div className={classes.row}>
            <div className={classes.header}>
                <FontAwesomeIcon icon="arrow-left" className={classes.arrowBack} onClick={navigateBack}/>
                <h3 className={`${classes.headerTitle} ${classes.arrowBack}`} onClick={navigateBack}>
                  Previous Page
                </h3>
            </div>

            <div className={classes.selectedMedia}>
              <figure className={classes.selectedMediaFigure}>
                <img
                  src={src}
                  alt=""
                  className={classes.selectedMediaImg}
                />
              </figure>
              <div className={classes.selectedMediaDescription}>
                <h2 className={classes.selectedMediaTitle}>
                  {title}
                </h2>


                {year ? <h3 className={classes.selectedMediaTitle}>
                  Year: {year && year.slice(0, 4)}
                </h3>
                :
                <h3 className={`${classes.selectedMediaTitle} ${classes.red}`}>
                  Year Not Listed by Api
                </h3>
                }

                {rating > 0 ?
                <h3 className={classes.selectedMediaTitle}>
                  Tmdb Rating: <span className={classes.mediaRating}>{rating}</span>
                </h3>
                :
                <h3 className={`${classes.selectedMediaTitle} ${classes.red}`}>
                  No Rating Available
                </h3>
                }

                {rating > 0 && <Rating rating={rating} />}


                

                

                {rating > 0 && <br />}

               {
               genre.length > 0 ?  
                <h3 className={classes.selectedMediaTitle}>
                  Genres: <span className={classes.genre}>{genre.map((g, idx) => (idx !== genre.length - 1) ? `${g.name}, ` : `${g.name}`)}</span>
                </h3>
                :
                <h3 className={`${classes.selectedMediaTitle} ${classes.red}`}>
                  No Genres Listed
                </h3>
                }


                <br />


                {summary ? 
                <div className={classes.mediaSummary}>
                  <h3 className={classes.selectedMediaTitle}>Summary</h3>
                  <p className={classes.mediaSummary}>{summary}</p>
                </div>
                :
                <div className={classes.mediaSummary}>
                  <h3 className={`${classes.selectedMediaTitle} ${classes.red}`}>No Summary Available</h3>
                </div>
                }




                <div className={classes.mediaInfoActions}>
                  {/* Button to movie homepage if there is one */}
                  {d.homepage &&
                    <a href={d.homepage} target="_blank">
                      {" "}
                      <button className={classes.button}>More Details</button>
                    </a>
                  }
                  {/* Button to movie imdb page if there isn't a homepage */}
                  {(imdbId && !d.homepage) &&
                    <a href={`https://m.imdb.com/title/${imdbId}/`} target="_blank">
                      {" "}
                      <button className={classes.button}>More Details</button>
                    </a>
                  }

                  {isLoggedIn && 
                  
                  <span className={ addedToWatchlist ? classes.addedMedia : classes.addMedia} onClick={() => addMediaToWatchlist(savedData, setLoading, setAddedToWatchlist, addedToWatchlist)} >


                    {loading && <FontAwesomeIcon icon={faSpinner} className={classes.spinner} />}

                    {(!addedToWatchlist && !loading) && <FontAwesomeIcon icon={faTimes} className={classes.addMediaIcon} />}

                    { (addedToWatchlist && !loading) && <p>Added to Watchlist!</p> }
                    {/* { addedToWatchlist ? <p>Added to Watchlist!</p> : <FontAwesomeIcon icon={faTimes} className='add-media__icon' />} */}
                  </span>
                  
                  }

                </div>





              </div>
            </div>
          </div>
          </div>
        </div>


        {/* CAST */}


        {cast.length > 0 ? <div className={classes.castContainer}>
          <div className={classes.castContainerFade}>
            <div className={classes.row}>
            {/* <div className="row bgblack"> */}
              <div className={classes.castSection}>
                <h2 className={classes.gold}>Cast</h2>
                <div className={classes.castWrapper}>
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
        <div className={classes.castContainerAlt}>
          <div className={classes.castContainerFade}>
              <h2 className={classes.castTitle}>{"Sorry, no Cast listed for this title via Api"}</h2>
          </div>
        </div>
        }

          
          


        {/* Suggested */}

        {relatedMedia.length > 0 ? (
          <div className={classes.suggestedContainer}>
            <div className={classes.row}>
              <div className={classes.suggestedHeader}>
                <h2 className={`${classes.selectedMediaTitle} ${classes.gold}`}>
                  Suggested Media:
                </h2>
              </div>
              <div className={classes.suggestedMedia}>
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
          <h2 className={classes.suggestedTitle}>{"Sorry, no related media for this title"}</h2>
        )}
      {/* </main> */}
    </div>
  );
};

export default MediaInfo;
