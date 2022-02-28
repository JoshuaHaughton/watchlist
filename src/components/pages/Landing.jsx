import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import tmdbApi from "../../api/tmdbApi";
import { apiConfig } from "../../api/axiosClient";

const Landing = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [backgroundMovieTitle, setBackgroundMovieTitle] = useState("");
  const navigate = useNavigate();

  // Navigate to search with whatever input the user put in
  const handleSubmit = (event) => {
    event.preventDefault();
    // Shows rotating logo icon for UI
    setLoading(true);

    if (query.trim().length > 0) {
      setTimeout(() => {
        setLoading(false);
        navigate("/search", { state: query });
      }, 500);
      return;
    }
    setIsValid(false);
    setLoading(false);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);

    if (e.target.value.trim().length > 0 && !isValid) {
      setIsValid(true);
    }
  };


  useEffect(() => {
    const fetchMovies = async () => {
      const response = await tmdbApi.getMoviesList('popular')
      console.log(response);

      const randomIndex = Math.floor(Math.random() * response.results.length-1);

      const src = apiConfig.originalImage(response.results[randomIndex].backdrop_path)

      document.getElementById('landing').style.backgroundImage=`url(${src})`;

      setBackgroundMovieTitle(response.results[randomIndex].title)

    }
    fetchMovies()
  }, [])

  return (
    <section id="landing">
      <div className="landing__fade">
        <div className="container">
          <div className="row">
            <div className="landing__wrapper">
              <h1 className="landing__title white">
                What's next on <span className="landing__title gold">your</span> watch list?
              </h1>
              {!isValid && (
                <p className="warning">Your search cannot be empty!</p>
              )}
              <form className="search__wrapper" onSubmit={handleSubmit}>
                <input
                  type="search"
                  placeholder={backgroundMovieTitle}
                  className="landing__input"
                  value={query}
                  onChange={handleChange}
                />
                <button className="btn btn__search">
                  {!loading ? (
                    <FontAwesomeIcon icon="search" />
                  ) : (
                    <FontAwesomeIcon icon="spinner" className="spinner" />
                  )}
                </button>
              </form>
              {/* <figure className="landing__img--wrapper">
                <img
                  src={landingLogo}
                  alt="Drawing of girl beside Netflix logo"
                  className="landing__img"
                />
              </figure> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
