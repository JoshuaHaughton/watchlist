import React, { useEffect, useState } from "react";
import tmdbApi from "../../../api/tmdbApi";
import classes from "./Actor.module.css";

const Actor = ({ id, name, character, src }) => {
  const [imdbId, setImdbId] = useState(null);

  //Stay on same page if an actor with no detail page is clicked
  const preventReload = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchActorDetails = async () => {
      const response = await tmdbApi.getActorDetails(id);
      setImdbId(response.imdb_id);
    };
    fetchActorDetails();
  }, []);

  return (
    <div>
      <a
        href={imdbId ? `https://www.imdb.com/name/${imdbId}` : ""}
        target={imdbId && "_blank"}
        className={classes.actorLink}
        onClick={!imdbId ? preventReload : undefined}
      >
        <div
          className={
            !imdbId
              ? `${classes.actorWrapper} ${classes.actorNoLink}`
              : classes.actorWrapper
          }
        >
          <figure className={classes.actorImgWrapper}>
            <img src={src} alt="actor-thumbnail" className={classes.actorImg} />

            <div
              className={
                !imdbId
                  ? `${classes.actorWrapperBg} ${classes.actorNoLink}`
                  : classes.actorWrapperBg
              }
            ></div>
            <div className={classes.actorTextOverlay}>
              {imdbId && (
                <p className={classes.actorText}>Click for Actor Details</p>
              )}
              {!imdbId && (
                <p className={classes.actorText}>
                  Actor Detail Page{" "}
                  <strong className={classes.red}>Unavailable</strong>
                </p>
              )}
            </div>
          </figure>
        </div>
      </a>

      <h3 className={classes.actorText}>{name}</h3>
      <p className={classes.actorText}>{character}</p>
    </div>
  );
};

export default Actor;
