import Rating from "../Rating/Rating";
import GrayBG from "../../../assets/GrayBG.jpeg";
import classes from "./MediaListItem.module.css";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

export default function MediaListItem(props) {
  const { handleClick, media, typeFormat, type } = props;
  const [img, setImg] = useState();

  //Whole component doesn't re-render with useRef unlike useState
  const mountedRef = useRef(true);

  //Loads skeleton image in place of vinyls until they load
  useEffect(() => {
    let image = new Image();
    if (props.src) {
      image.src = props.src || "null";

      image.onload = () => {
        if (props.src) {
          setImg(image);
        }
      };
    }
    return () => {
      //when the component unmounts
      mountedRef.current = false;
    };
  }, [props.src]);

  return (
    <figure
      className={classes.imageWrapper}
      onClick={() => handleClick(media.id)}
    >
      <img
        src={img ? img.src : GrayBG}
        alt={props.skeleton ? "Skeleton Placheholder" : media.title}
        className={classes.img}
        key={media.id}
      />
      <div className={classes.imageWrapperBg}></div>
      {!props.skeleton && (
        <div className={classes.mediaDescription}>
          <h3 className={classes.mediaTitle}>{media.title || media.name}</h3>
          <h5 className={classes.mediaYear}>
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
