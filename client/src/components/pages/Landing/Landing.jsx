import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import tmdbApi from "../../../api/tmdbApi";
import { apiConfig } from "../../../api/axiosClient";
import classes from './Landing.module.css'

const Landing = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  //Used as a placeholder for the input
  const [backgroundMovieTitle, setBackgroundMovieTitle] = useState("");
  const navigate = useNavigate();
  let location = useLocation().pathname;



  // Navigate to search with whatever input the user input
  const handleSubmit = (event) => {
    event.preventDefault();

    // Shows rotating logo icon for UI
    setLoading(true);


    // If trimmed input is empty
    if (query.trim().length < 1) {
      setIsValid(false);
      setLoading(false);
      return;
    }

    // Else, slight delay to show loading spinner for UX before navigating to search page with query as state
    setTimeout(() => {
      setLoading(false);
      navigate("/search", { state: query });
    }, 500);

  };


  //Handle state
  const handleChange = (e) => {
    setQuery(e.target.value);

    //Reset validity once changes are made
    if (e.target.value.trim().length > 0 && !isValid) {
      setIsValid(true);
    }
  };



  useEffect(() => {
    //Fetch random movie backdrop from popular movies
    const fetchBackgroundMovie = async () => {
      const response = await tmdbApi.getMoviesList('popular')
      const randomIndex = Math.floor(Math.random() * response.results.length-1);

      let src = null;
      console.log(response.results);
      console.log(randomIndex)
      if (response.results[randomIndex].backdrop_path) {
        src = apiConfig.originalImage(response.results[randomIndex].backdrop_path)
      } else if (response.results[randomIndex].poster_path) {
        src = apiConfig.originalImage(response.results[randomIndex].poster_path)
      }

      //Sets background image of landing div
      {src && (document.getElementById('landing').style.backgroundImage=`url(${src})`)};

      //Set title of background movie to be used as placeholder for input
      setBackgroundMovieTitle(response.results[randomIndex].title)
    }

    fetchBackgroundMovie()

  }, [location])

  return (
    <section id='landing' className={classes.landing}>
      <div className={classes.landingFade}>
        <div className={classes.container}>
          <div className={classes.row}>
            <div className={classes.landingWrapper}>
              <h1 className={`${classes.title} ${classes.white}`}>
                What's next on <span className={`${classes.title} ${classes.gold}`}>your</span> watch list?
              </h1>
              {!isValid && (
                <p className={classes.warning}>Your search cannot be empty!</p>
              )}

              
              {/* <div className="landing__search--wrapper"> */}
                <form className={classes.searchWrapper} onSubmit={handleSubmit} autoComplete="on">
                  <input
                    type="search"
                    placeholder={backgroundMovieTitle}
                    className={classes.input}
                    value={query}
                    onChange={handleChange}
                  />
                  <button className={classes.searchButton}>
                    {!loading ? (
                      <FontAwesomeIcon icon="search" />
                    ) : (
                      <FontAwesomeIcon icon="spinner" className={classes.spinner} />
                    )}
                  </button>
                </form>
                {/* <FontAwesomeIcon icon="search" className="landing__search--icon"/> */}
              {/* </div> */}


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
