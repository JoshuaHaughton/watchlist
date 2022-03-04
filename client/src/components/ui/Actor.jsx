import React, { useEffect, useState } from "react";
import tmdbApi from "../../api/tmdbApi";
import Placeholder from "../../assets/No-Image-Placeholder.svg.png";

const Actor = ({ id, name, character, src }) => {
  const [imdbId, setImdbId] = useState(null);

  //Stay on same page if an actor with no detail page is clicked
  const preventReload = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchActorDetails = async () => {
      const response = await tmdbApi.getActorDetails(id);
      console.log(id);
      console.log(response, "actor");
      setImdbId(response.imdb_id);
    };
    fetchActorDetails();
  }, []);


  return (
    <div className="actor__card">
      <a
        href={imdbId ? `https://www.imdb.com/name/${imdbId}` : ''}
        target={imdbId && "_blank"}
        className="actor__link"
        onClick={!imdbId ? preventReload : undefined}
      >
        <div className="actor__wrapper">
          <figure className="actor__img--wrapper" >
            <img src={src} alt="actor-thumbnail" className="actor__img" />

            <div className="actor__wrapper--bg">



            </div>
            <div className="actor__text--overlay">
            {imdbId && (
              <p className="actor__text white">Click for Actor Details</p>
            )}
            {!imdbId && (
              <p className="actor__text white">
                Actor Detail Page <strong className="red">Unavailable</strong>
              </p>
            )}
          </div>
          </figure>

          
        </div>
      </a>

      <h3 className="actor__name white">{name}</h3>
      <p className="actor__character white">{character}</p>
    </div>
  );
};

export default Actor;
