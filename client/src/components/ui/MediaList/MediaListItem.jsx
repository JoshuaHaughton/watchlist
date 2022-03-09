import Rating from "../Rating/Rating";
import GrayBG from "../../../assets/GrayBG.jpeg";
import classes from "./MediaListItem.module.css";

export default function MediaListItem(props) {
  const { handleClick, media, typeFormat, type } = props;

  return (
    <figure
      className={classes.imageWrapper}
      onClick={() => handleClick(media.id)}
    >
      <img
        src={!props.src ? GrayBG : props.src}
        alt={props.skeleton ? "Skeleton Placheholder" : media.title}
        className={classes.img}
        key={media.id}
      />
      <div className={classes.imageWrapperBg}></div>
      {!props.skeleton && (
        <div className={classes.mediaDescription}>
          <h3 className={classes.mediaTitle}>{media.title || media.name}</h3>
          <h5 className={classes.mediaSubtitle}>
            {media.release_date || media.first_air_date}
          </h5>
          {(media && media.vote_average) > 0 ? (
            <Rating rating={media.vote_average} />
          ) : (
            <p className={classes.red}>No Rating</p>
          )}
          <br />
          <h3 className={classes.mediaSubtitle}>{typeFormat(type)}</h3>
        </div>
      )}
    </figure>
  );
}
