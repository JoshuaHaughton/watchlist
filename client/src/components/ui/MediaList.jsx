import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { apiConfig } from '../../api/axiosClient';
import GrayBG from '../../assets/GrayBG.jpeg'
import tmdbApi from '../../api/tmdbApi'
import Rating from './Rating';
import { typeFormat } from '../helpers/MediaHelpers';

const MediaList = (props) => {
  const [mediaList, setMediaList] = useState();

  //Skeleton array used for loading state
  const loadingArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const navigate = useNavigate();


  const handleClick = (id) => {
    navigate(`/${props.type}/${id}`)
  }
  

  useEffect(() => {
    //Set to null to show skeleton while fetching results
    setMediaList(null)

    const fetchMediaList = async () => {
      const response = await tmdbApi.getMediaList(props.category, props.type);
      let newList = response.results

      //For the upcoming list, only return movies that haven't been released
      // if (props.category === 'upcoming') {
      //   const now = new Date().getTime()
      //   console.log(now, 'UPCOME');

      //   newList = newList.filter(media => {
      //     let releaseDate = new Date(media.release_date);
      //     return releaseDate > now;
      //   })
      // }

      //The above currently doesn't't currently render a lot of movies because more need to be announced! Will comment out for now

      setMediaList(newList)
    }

    fetchMediaList();
    //Rerenders component when user changes sort fiter
  }, [props.type])
  

  return (
    <div className='media__list--wrapper'>
      <h2 className='media__list--title'>{props.title}</h2>
      <p className='media__list--description'>{props.description}</p>
      <div className="media__list">
        {
          mediaList ? 
          mediaList.map(media => {
            console.log(media);
            return (
              <figure className='list__img--wrapper' onClick={() => handleClick(media.id)}>
              <img src={apiConfig.originalImage(media.poster_path)} alt={media.title} className='media__list--img' key={media.id}/>
              <div className="media__wrapper--bg"></div>
              <div className="list__item--description">
                <h3 className={`media__title`}>{media.title || media.name}</h3>
                <h5 className={`media__year`}>{media.release_date || media.first_air_date}</h5>
                {(media && media.vote_average) > 0 ? <Rating rating={media.vote_average} /> : <p className='red'>No Rating</p>}
                <br />
                <h3 className={`media__title`}>{typeFormat(props.type)}</h3>
              </div>
          </figure>
            )
          }) :
          loadingArray.map(num => {
            return (
              <figure className='list__img--wrapper'>
                <img src={GrayBG} alt={'Skeleton Placeholder'} className='media__list--img' key={num}/>
                <div className="media__wrapper--bg"></div>
              </figure>
            )
          })

          }
      </div>
    </div>
  )
}

export default MediaList