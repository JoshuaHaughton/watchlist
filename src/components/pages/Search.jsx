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
  //Renders a skeleton state for movies while movie data is being fetched
  const [loading, setLoading] = useState(false);
  //When false, won't submit a query to fetch data
  const [valid, setValid] = useState(true);
  //If an error message is returned, this state is used to render it to the user
  const [errorMessage, setErrorMessage] = useState('')
  

  //Will populate media search while results are being fetched
  const skeletonArr = [{
    id: 1,
    Title: '-',
    Type: '-',
    Year: '-'
  },
  {
    id: 2,
    Title: '-',
    Type: '-',
    Year: '-'
  },
  {
    id: 3,
    Title: '-',
    Type: '-',
    Year: '-'
  },
  {
    id: 4,
    Title: '-',
    Type: '-',
    Year: '-'
  }]

    const validateQuery = (queryBeingValidated) => {
      if (queryBeingValidated.trim().length < 1) {
        setValid(false)
        setErrorMessage("Error! Cannot make a search for an empty string.")
        return;
      }
      setValid(true)
    }


  const handleClick = () => {
    validateQuery(query)
    if (valid) {
      setSearchFor(query);
      setSortValue("DEFAULT");
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    //If key pressed was enter, validate the query
    if (event.key === "Enter") {
      validateQuery(query);
      if(valid) {
        setSearchFor(query);
        setSortValue("DEFAULT");
        setLoading(false);
      }
    } else {
      setValid(true)
    }
  };



  useEffect(() => {
    setLoading(true);
    //Returns list of movies from OMDapi for given query
    fetchQueryData(searchFor, setResults, setValid, setLoading, setErrorMessage);

    //Runs on first mount (Initial search if there is one) and whenever the search button is clicked
  }, [searchFor]);


  return (
    <>
      <section id="search__header">
        <div className="search__header--container">
          <div className="row">
            <div className="search__header--wrapper">
              <h1>
                What are <span className="gold">you </span>watching?
              </h1>
              <div className="search__wrapper">
                <input
                  type="search"
                  placeholder="Search by Title"
                  className="header__input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="btn btn__search" onClick={handleClick}>
                  <FontAwesomeIcon icon="search" />
                </button>
              </div>
              {!valid && <p className="warning">{errorMessage}</p>}
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
                {!loading ? results.map((result) => {
                  if (result.Type === "movie") {
                    return <Media media={result} key={result.imdbID} />;
                  }
                }) : 
                  skeletonArr.map(result => {
                    return <Media media={result} key={result.id} />;
                  })
                }
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
