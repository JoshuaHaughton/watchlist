import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Media from "../ui/Media";
import image from "../../assets/Search.svg";
import {
  fetchQueryData,
  sortResults,
} from "../../components/helpers/SearchHepers";

const Search = () => {
  //State given from Landing component if a search was made from there
  const { state } = useLocation();
  //What is currently being searched for
  const [searchFor, setSearchFor] = useState(state || "");
  //What is currently in the input field. Will not search until enter, or button next to input is pressed
  const [query, setQuery] = useState(state || "");
  //Results from search
  const [results, setResults] = useState("");
  //Current sorting method for results
  const [sortValue, setSortValue] = useState("DEFAULT");
  //If true (too many results error came back from request) then render output to let user know their search was too broad
  const [tooBroad, setTooBroad] = useState(false);

  let searchTitle;
  !tooBroad
    ? (searchTitle = (
        <h1>
          What are <span class="gold">you </span>watching?
        </h1>
      ))
    : (searchTitle = <h1 class="Red">Please try a broader search!</h1>);

  const handleClick = () => {
    setSearchFor(query);
    setSortValue("DEFAULT");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchFor(query);
      setSortValue("DEFAULT");
    }
  };

  useEffect(() => {
    //Returns list of movies from OMDapi for given query
    fetchQueryData(searchFor, setResults, setTooBroad);

    //Runs on first mount (Initial search if there is one) and whenever the search button is clicked
  }, [searchFor]);

  return (
    <>
      <section id="search__header">
        <div className="container">
          <div className="row">
            <div className="search__header--wrapper">
              {searchTitle}
              <div className="search__wrapper">
                <input
                  type="search"
                  placeholder="Search by Title"
                  className="header__input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button class="btn btn__search" onClick={handleClick}>
                  <FontAwesomeIcon icon="search" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {results ? (
        <section className="search__results">
          <div className="container">
            <div className="row">
              <div className="results__heading--wrapper">
                <h2 className="results__title">Search Results:</h2>
                <div className="sort__wrapper">
                  <h3>Sort By: </h3>
                  <select
                    id="filter"
                    value={sortValue}
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

              <div className="results__wrapper">
                {results.map((result) => {
                  if (result.Type === "movie") {
                    return <Media media={result} key={result.imdbID} />;
                  }
                })}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <figure className="search__img--wrapper">
          <img src={image} alt="" />
        </figure>
      )}
    </>
  );
};

export default Search;
