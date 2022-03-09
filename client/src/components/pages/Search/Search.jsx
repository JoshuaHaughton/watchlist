import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Media from "../../ui/Media/Media";
import searchImage from "../../../assets/Search.svg";
import classes from "./Search.module.css";
import { fetchQueryData, sortResults, skeletonArr } from "./SearchHepers";

const Search = () => {
  //State given from Landing component if a search was made from there
  const { state } = useLocation();
  //What is currently being searched for. Dependency of useEffect
  const [searchFor, setSearchFor] = useState(state || "");
  //What is currently in the input field. Will not search until enter, or button next to input is pressed
  const [query, setQuery] = useState(state || "");
  const [results, setResults] = useState([]);
  const [sortValue, setSortValue] = useState("DEFAULT");
  //Renders a skeleton state for movies while movie data is being fetched
  const [loading, setLoading] = useState(false);
  //When false, won't submit a query to fetch data
  const [valid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchComplete, setSearchComplete] = useState(false);


  //Validates query being searched for
  const validateQuery = (queryBeingValidated) => {
    if (queryBeingValidated.trim().length < 1) {
      setValid(false);
      setErrorMessage("Error! Cannot make a search for an empty string.");
      return false;
    }
    setValid(true);
    return true;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    //Searches for query if valid
    const validated = validateQuery(query);
    if (validated) {
      //setSearchFor triggers useEffect
      setLoading(true);
      setSearchFor(query);
      setSortValue("DEFAULT");
    }
  };


  const handleChange = (event) => {
    if (!valid) {
      setValid(true);
    }
    setQuery(event.target.value);
  };


  useEffect(() => {
    //Returns list of movies from tmdbApi for given query
    fetchQueryData(searchFor, setResults, setLoading, setSearchComplete);

    //Runs on first mount (Initial search if there is one) and whenever the search button is clicked
  }, [searchFor]);


  return (
    <>
      <section className={classes.header}>
        <div className={classes.row}>
          <div className={classes.headerContainer}>
            <div className={classes.headerWrapper}>
              <h1 className={classes.searchTitle}>
                What are{" "}
                <span className={`${classes.titleFont} ${classes.gold}`}>
                  you{" "}
                </span>
                watching?
              </h1>
              {!valid && <p className={classes.warning}>{errorMessage}</p>}
              <form className={classes.searchWrapper} onSubmit={handleSubmit}>
                <input
                  type="search"
                  placeholder="Search by Title"
                  className={classes.input}
                  value={query}
                  onChange={handleChange}
                />
                <button className={classes.searchButton}>
                  {!loading ? (
                    <FontAwesomeIcon icon="search" />
                  ) : (
                    <FontAwesomeIcon
                      icon="spinner"
                      className={`${classes.spinner} ${classes.gold}`}
                    />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className={classes.searchResults}>
        <div className={classes.resultsContainer}>
          <div className={classes.searchRow}>
            <div className={classes.resultsHeadingWrapper}>
              <h2 className={classes.resultsTitle}>Search Results:</h2>
              <div className={classes.sortWrapper}>
                <h3 className={classes.white}>Sort By: </h3>
                <select
                  id="filter"
                  value={sortValue}
                  className={classes.select}
                  onChange={(e) =>
                    sortResults(
                      e.target.value,
                      results,
                      setResults,
                      setSortValue,
                    )
                  }
                >
                  <option value="DEFAULT" disabled>
                    Sort
                  </option>
                  <option value="OLDEST">Oldest</option>
                  <option value="NEWEST">Newest</option>
                  <option value="TITLE">Title</option>
                </select>
              </div>
            </div>

            <div className={classes.resultsWrapper}>


              {results.length > 0 &&
                !loading &&
                results.map((result) => {
                  return <Media media={result} key={result.id} />;
                })}


              {loading &&
                skeletonArr.map((result) => {
                  return <Media media={result} key={result.id} />;
                })}


              {results.length < 1 && searchComplete && (
                <h2 className={classes.errorTitle}>No Results Found!</h2>
              )}
            </div>

            {results.length < 1 && !loading && (
              <figure className={classes.searchImgWrapper}>
                <img src={searchImage} alt="Default Saerch Image" />
              </figure>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
