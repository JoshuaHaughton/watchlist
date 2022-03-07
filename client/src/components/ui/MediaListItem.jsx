import { apiConfig } from "../../api/axiosClient";
import Rating from "./Rating";
import GrayBG from '../../assets/GrayBG.jpeg'

export default function MediaListItem(props) {
  const { handleClick, media, typeFormat, type } = props;

  return (
    <figure
      className="list__img--wrapper"
      onClick={() => handleClick(media.id)}
    >
      <img
        src={
          !props.src ? GrayBG : props.src
        }
        alt={props.skeleton ? "Skeleton Placheholder" : media.title}
        className="media__list--img"
        key={media.id}
      />
      <div className="media__wrapper--bg"></div>
      {!props.skeleton &&
      <div className="list__item--description">
        <h3 className={`media__title`}>{media.title || media.name}</h3>
        <h5 className={`media__year`}>
          {media.release_date || media.first_air_date}
        </h5>
        {(media && media.vote_average) > 0 ? (
          <Rating rating={media.vote_average} />
        ) : (
          <p className="red">No Rating</p>
        )}
        <br />
        <h3 className={`media__title`}>{typeFormat(type)}</h3>
      </div>
}
    </figure>
  );
}
