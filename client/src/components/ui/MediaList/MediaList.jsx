import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { apiConfig } from '../../../api/axiosClient';
import tmdbApi from '../../../api/tmdbApi'
import { typeFormat } from '../../helpers/MediaHelpers';
import MediaListItem from './MediaListItem';
import classes from './MediaList.module.css'
import { mediaListLoadingArray } from './MediaListHelpers';

const MediaList = (props) => {
  const [mediaList, setMediaList] = useState();
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();


  const handleClick = (id) => {
    navigate(`/${props.type}/${id}`)
  }
  

  useEffect(() => {
    //Set to null to show skeleton while fetching results
    setMediaList(null)

    //Fetch and set results to state
    const fetchMediaList = async () => {
      setLoading(true)
      const response = await tmdbApi.getMediaList(props.category, props.type);
      let newList = response.results
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
          mediaListLoadingArray.map(item => {
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