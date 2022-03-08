import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { apiConfig } from '../../../api/axiosClient';
import GrayBG from '../../../assets/GrayBG.jpeg'
import tmdbApi from '../../../api/tmdbApi'
import Rating from '../Rating/Rating';
import { typeFormat } from '../../helpers/MediaHelpers';
import MediaListItem from './MediaListItem';
import classes from './MediaList.module.css'

const MediaList = (props) => {
  const [mediaList, setMediaList] = useState();
  const [loading, setLoading] = useState(false)

  //Skeleton array used for loading state
  const loadingArray = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
    {
      id: 8,
    },
    {
      id: 9,
    }
  ];


  const navigate = useNavigate();


  const handleClick = (id) => {
    navigate(`/${props.type}/${id}`)
  }
  

  useEffect(() => {
    //Set to null to show skeleton while fetching results
    setMediaList(null)

    const fetchMediaList = async () => {
      setLoading(true)
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
      setLoading(false)
    }

    fetchMediaList();
    //Rerenders component when user changes sort fiter
  }, [props.type])
  

  return (
    <div className={classes.mediaListWrapper}>
      <h2 className={classes.mediaListTitle}>{props.title}</h2>
      <p className={classes.mediaListDescription}>{props.description}</p>
      <div className={classes.mediaList}>
        {
         ( mediaList && !loading) ? 
          mediaList.map(media => {
            console.log(media);
            return (
             <MediaListItem 
             handleClick={handleClick} 
             media={media}
             src={apiConfig.w500Image(media.poster_path)}
             type={props.type} 
             typeFormat={typeFormat}  />
            )
          }) :
          loadingArray.map(item => {
            return (

            <MediaListItem 
             handleClick={handleClick} 
             media={item}
             skeleton={true}
             typeFormat={typeFormat}  />
            )
          })

          }
      </div>
    </div>
  )
}

  export default MediaList