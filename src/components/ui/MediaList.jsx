import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { apiConfig } from '../../api/axiosClient';
import GrayBG from '../../assets/GrayBG.jpeg'
import tmdbApi from '../../api/tmdbApi'

const MediaList = (props) => {
  const [mediaList, setMediaList] = useState();
  // const [loadingArray, setLoadingArray] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const loadingArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/${props.type}/${id}`)
  }
  

  useEffect(() => {
    const fetchMediaList = async () => {
      const response = await tmdbApi.getMediaList(props.category, props.type);
      console.log(response);

      setMediaList(response.results)
      // setLoadingArray(null)

    }

    fetchMediaList();
  }, [props.type])

  return (
    <div className='media__list--wrapper'>
      <h2 className='white'>{props.title}</h2>
      <div className="media__list">
        {
          mediaList ? 
          mediaList.map(media => {
            return (
              <img src={apiConfig.originalImage(media.poster_path)} alt={media.title} className='media__list--img' key={media.id} onClick={() => handleClick(media.id)}/>
            )
          }) :
          loadingArray.map(num => {
            return (
              <img src={GrayBG} alt={'Skeleton Placeholder'} className='media__list--img' key={num}/>
            )
          })

          }
      </div>
    </div>
  )
}

export default MediaList