import React, { useState, useEffect } from "react";
import MediaList from "../ui/MediaList";

const Discover = () => {
  const [mediaType, setMediaType] = useState("movie");
  const [categories, setCategories] = useState({
    popular: (
      <MediaList 
        title="Popular Movies" 
        category="popular" 
        type={mediaType} 
      />
    ),
    top_rated: (
      <MediaList
        title="Top Rated Movies"
        category="top_rated"
        type={mediaType}
      />
    ),
    current: (
      <MediaList
        title="Movies Out Now"
        category="now_playing"
        type={mediaType}
      />
    ),
  });


  const sortMedia = (filter) => {
    setMediaType(filter);
  };


  useEffect(() => {
    if (mediaType === "movie") {

      setCategories({
        popular: (
          <MediaList
            title="Popular Movies"
            category="popular"
            type={mediaType}
          />
        ),
        top_rated: (
          <MediaList
            title="Top Rated Movies"
            category="top_rated"
            type={mediaType}
          />
        ),
        current: (
          <MediaList
            title="Movies Out Now"
            category="now_playing"
            type={mediaType}
          />
        ),
      });


    } else {

      
      setCategories({
        popular: (
          <MediaList
            title="Popular Shows"
            category="popular"
            type={mediaType}
          />
        ),
        top_rated: (
          <MediaList
            title="Top Rated TV Shows"
            category="top_rated"
            type={mediaType}
          />
        ),
        current: (
          <MediaList
            title="Tv Series Out Now"
            category="on_the_air"
            type={mediaType}
          />
        ),
      });
    }
  }, [mediaType]);

  return (
    <section id="discover">
      <div className="container discover__container">
        <div className="discover__row">
          <div className="discover__filter--wrapper">
            <select
              id="discover__filter"
              value={mediaType}
              onChange={(e) => sortMedia(e.target.value)}
            >
              <option value="movie">Movies</option>
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
  );
};

export default Discover;
