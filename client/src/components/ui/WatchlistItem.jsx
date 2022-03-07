import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import placeholder from "../../assets/No-Image-Placeholder.svg.png";
import { typeFormat } from "../helpers/MediaHelpers";
import skeletonImg from "../../assets/WatchlistSkeleton.png";
import { apiConfig } from "../../api/axiosClient";
import Rating from "./Rating";
import classes from "./WatchlistItem.module.css";
import UserRating from "./UserRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import UserLike from "./UserLike";
import WatchedIcon from "./WatchedIcon";
import { set } from "lodash";
import DeleteItemModal from "./Modals/DeleteItemModal/DeleteItemModal";

const WatchlistItem = (props) => {
  const { media, reloadWatchlist } = props;
  const [frontendRating, setFrontendRating] = useState(media.my_rating);
  const [frontendWatched, setFrontendWatched] = useState(media.watched);
  const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);
  console.log(media, "media");

  const openDeleteItemModalHandler = () => {
    setOpenDeleteItemModal(true);
  };

  const closeDeleteItemModalHandler = () => {
    setOpenDeleteItemModal(false);
  };

  //Deside class based on if the media given was a skeleton or not (for loading state)
  let classType;
  !media.skeleton ? (classType = "media") : (classType = "skeleton");

  //Format image path based on what images are available
  let imagePath;

  if (media.backdrop_path) {
    imagePath = apiConfig.w500Image(media.backdrop_path);
  } else if (media.poster_path) {
    imagePath = apiConfig.w500Image(media.poster_path);
  } else if (media.skeleton) {
    //Blank background for loading state
    imagePath = skeletonImg;
  } else {
    //"No image available" placeholder
    imagePath = placeholder;
  }

  useEffect(() => {
    // if(frontendWatched)
    if (frontendRating && !frontendWatched) {
      setFrontendWatched(true);
    }
  }, [frontendWatched, frontendRating]);

  return (
    <>
      {openDeleteItemModal && (
        <DeleteItemModal
          title={"Delete Item Confirmation"}
          message={
            "Are you sure you want to delete this item from your watchlist? You'll lose all of your ratings for this title."
          }
          closeModal={closeDeleteItemModalHandler}
          mediaId={media.tmdb_id}
          reloadWatchlist={reloadWatchlist}
        />
      )}
      <div className={classes.card}>
        <Link to={`/${media.type}/${media.tmdb_id}`}>
          <div className={classes.mediaWrapper}>
            <figure className={classes.mediaImgWrapper}>
              <img
                src={imagePath ? imagePath : skeletonImg}
                alt={media.title}
                className={classes.mediaCardImg}
              />
              <div className={classes.mediaWrapperBg}></div>
            </figure>
            {!media.skeleton && (
              <div className={classes.hoverDetails}>
                <h3 className={classes[`${classType}Title`]}>
                  {media.title || media.name}
                </h3>
                <h5 className={classes[`${classType}Year`]}>
                  {media.release_date}
                </h5>
                <h3 className={`${classes.mediaTitle} ${classes.gold}`}>
                  Click for more details!
                </h3>
                {/* <h3 className={classes.mediaTitle}>TMDB rating:</h3>
            {(media && media.tmdb_rating) > 0 ? <Rating rating={media.tmdb_rating} /> : <p>No Ratings<br /></p>} */}
                <br />
                <h3 className={classes.mediaTitle}>{typeFormat(media.type)}</h3>
              </div>
            )}
          </div>
        </Link>

        <div className={classes.description}>
          <h3
            className={
              media.skeleton ? classes.skeletonDescription : classes.mediaTitles
            }
          >
            {media.title}
          </h3>
          <div
            className={
              media.skeleton
                ? classes.skeletonDescription
                : classes.mediaParagraph
            }
          >
            My rating:{" "}
            <UserRating
              frontendRating={frontendRating}
              setFrontendRating={setFrontendRating}
              frontendWatched={frontendWatched}
              setFrontendWatched={setFrontendWatched}
              mediaId={media.tmdb_id}
              skeleton={media.skeleton ? media.skeleton : false}
            />
          </div>
          <div
            className={
              media.skeleton
                ? classes.skeletonDescription
                : `${classes.mediaParagraph} ${classes.watchedIcon}`
            }
          >
            Watched:{" "}
            <WatchedIcon
              frontendWatched={frontendWatched}
              setFrontendWatched={setFrontendWatched}
              frontendRating={frontendRating}
              setFrontendRating={setFrontendRating}
              mediaId={media.tmdb_id}
              skeleton={media.skeleton ? media.skeleton : false}
            />{" "}
          </div>
          <br />

          <div className={classes.descriptionBottomRow}>
            <p
              className={
                media.skeleton
                  ? classes.skeletonDescription
                  : classes.mediaParagraph
              }
            >
              {typeFormat(media.type)}
            </p>
            {!media.skeleton && (
              <div className={classes.userActions}>
                <UserLike liked={media.liked} mediaId={media.tmdb_id} />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={`${classes.actionIcon} ${classes.deleteIcon}`}
                  onClick={openDeleteItemModalHandler}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchlistItem;
