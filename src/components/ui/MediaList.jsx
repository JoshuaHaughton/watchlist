import React, { useEffect, useState } from 'react'
import { apiConfig } from '../../api/axiosClient';
import tmdbApi from '../../api/tmdbApi'

const MediaList = (props) => {
  const [mediaList, setMediaList] = useState([]);
  

  useEffect(() => {
    const fetchMovieList = async () => {
      const response = await tmdbApi.getMoviesList(props.category);
      console.log(response);

      setMediaList(response.results)
      console.log(mediaList);

    }

    fetchMovieList();
  }, [])

  return (
    <div className='media__list--wrapper'>
      <h2 className='white'>{props.title}</h2>
      <div className="media__list">
        {
          mediaList.length > 0 && mediaList.map(media => {
            return (
              <img src={apiConfig.originalImage(media.poster_path)} alt={media.title} className='media__list--img' key={media.id}/>
            )
          })}
      </div>
    </div>
  )
}

export default MediaList