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
            description="Browse a collection of today's most popular movies!"
            type={mediaType}
          />
        ),
        top_rated: (
          <MediaList
            title="Top Rated Movies"
            category="top_rated"
            description="Browse a collection of the highest rated movies on TMDB"
            type={mediaType}
          />
        ),
        current: (
          <MediaList
            title="Movies Out Now"
            category="now_playing"
            description="Browse a collection of movies out now"
            type={mediaType}
          />
        ),
        upcoming: (
          <MediaList
            title="Upcoming Movies"
            category="upcoming"
            description="Browse a collection of both unreleased and recently released movies"
            type={mediaType}
          />
        )
      });


    } else {

      
      setCategories({
        popular: (
          <MediaList
            title="Popular Shows"
            category="popular"
            description="Browse a collection of today's most popular series"
            type={mediaType}
          />
        ),
        top_rated: (
          <MediaList
            title="Top Rated TV Shows"
            category="top_rated"
            description='Browse a collection of the highest rated Tv Shows on TMDB'
            type={mediaType}
          />
        ),
        current: (
          <MediaList
            title="Tv Series Out Now"
            category="on_the_air"
            description="Browse a collection of ongoing Tv Shows"
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
        <h1 className="page__header gold">Discover</h1>
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
            {(categories && categories.upcoming) && categories.upcoming}
            {categories && categories.current}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discover;
