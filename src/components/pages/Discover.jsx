import React, { useState } from 'react'
import MediaList from '../ui/MediaList'

const Discover = () => {
  const [mediaType, setMediaType] = useState('movie')

  const sortMedia = (filter) => {
    //Visually changes value of filter for user
    setMediaType(filter);
  
    // if (filter === "movies") {
    //   setMediaType(filter);
    // }
  
    // if (filter === "series") {
    //   setResults(results.slice().sort((a, b) => b.Year - a.Year));
    // }
  
    // if (filter === "TITLE") {
    //   setResults(
    //     results.slice().sort((a, b) =>
    //       a.Title.localeCompare(b.Title, undefined, {
    //         numeric: true,
    //         sensitivity: "base",
    //       }),
    //     ),
    //   );
    // }
  };

  let categories = {};

  if (mediaType === 'movie') {
    categories.popular = <MediaList title="Popular Movies" category="popular" type={mediaType}/>
    categories.top_rated = <MediaList title="Top Rated Movies" category="top_rated" type={mediaType}/>
    categories.current = <MediaList title="Movies Out Now" category="now_playing" type={mediaType}/>
  } else {
    categories.popular = <MediaList title="Popular Shows" category="popular" type={mediaType}/>
    categories.top_rated = <MediaList title="Top Rated TV Shows" category="top_rated" type={mediaType}/>
    categories.current = <MediaList title="Tv Series Out Now" category="on_the_air" type={mediaType}/>
  }



  return (
    <section id="discover">
      <div className="container discover__container">
        <div className="discover__row">
          <div className="discover__filter--wrapper">
            {/* <h2 className='discovery__title'>{mediaType}</h2> */}
            <select
                    id="discover__filter"
                    value={mediaType}
                    onChange={(e) =>
                      sortMedia(
                        e.target.value
                      )
                    }
                  >
                    <option value="movie">
                      Movies
                    </option>
                    <option value="tv">Series</option>
                  </select>
          </div>
          <div className="media__lists">
            {categories && categories.popular}
            {categories && categories.top_rated}
            {categories && categories.current}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Discover