import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MediaList from "../ui/MediaList";

const Discover = () => {
  const [mediaType, setMediaType] = useState("movie");
  const navigate = useNavigate();
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
  }

  const navigateBack = () => {
    navigate(-1);
  }


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
            description="Check out the highest rated movies on TMDB!"
            type={mediaType}
          />
        ),
        current: (
          <MediaList
            title="Movies Out Now"
            category="now_playing"
            description="Browse a list of movies out now!"
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
            description='Check out the highest rated Tv Shows on TMDB'
            type={mediaType}
          />
        ),
        current: (
          <MediaList
            title="Tv Series Out Now"
            category="on_the_air"
            description="Browse a list of ongoing Tv Shows"
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
        <div className="page__description">


          <div className="discover__header--row">

            <div className="discover__arrow--wrapper">
              <FontAwesomeIcon icon="arrow-left" className="discover__arrow white click" onClick={navigateBack}/>
            </div>

              <h1 className="page__header gold">Discover</h1>


              <div className="discover__filter--wrapper">
                <select
                  className="discover__filter"
                  value={mediaType}
                  onChange={(e) => sortMedia(e.target.value)}
                >
                  <option value="movie">Movies</option>
                  <option value="tv">Series</option>
                </select>
              </div>


          </div>

        <p className="white">In search of something bingeworthy? Look no further!</p>

        <hr />
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
