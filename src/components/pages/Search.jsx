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
  //What is currently being searched for. Dependency of useEffect
  const [searchFor, setSearchFor] = useState(state || "");
  //What is currently in the input field. Will not search until enter, or button next to input is pressed
  const [query, setQuery] = useState(state || "");
  const [results, setResults] = useState("");
  const [sortValue, setSortValue] = useState("DEFAULT");
  //Renders a skeleton state for movies while movie data is being fetched
  const [loading, setLoading] = useState(false);
  //When false, won't submit a query to fetch data
  const [valid, setValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('')
  


  //Will populate media search while results are being fetched
  const skeletonArr = [{
    id: 1,
    title: '-',
    media_type: '-',
    release_date: '-',
    skeleton: true
  },
  {
    id: 2,
    title: '-',
    media_type: '-',
    release_date: '-',
    skeleton: true
  },
  {
    id: 3,
    title: '-',
    media_type: '-',
    release_date: '-',
    skeleton: true
  },
  {
    id: 4,
    title: '-',
    media_type: '-',
    release_date: '-',
    skeleton: true
  }]



    const validateQuery = (queryBeingValidated) => {
      if (queryBeingValidated.trim().length < 1) {
        setValid(false)
        setErrorMessage("Error! Cannot make a search for an empty string.")
        return;
      }
      setValid(true)
    }


  const handleSubmit = async (event) => {
    event.preventDefault();

    validateQuery(query)
    if (valid) {
      setLoading(false);
      //setSearchFor triggers useEffect
      setSearchFor(query);
      setSortValue("DEFAULT");
    }
  };



  useEffect(() => {
    setLoading(true);

    //Returns list of movies from tmdbApi for given query
    fetchQueryData(searchFor, setResults, setLoading);

    //Runs on first mount (Initial search if there is one) and whenever the search button is clicked
  }, [searchFor]);


  return (
    <>
      <section id="search__header">
        <div className="search__header--container">
          <div className="row">
            <div className="search__header--wrapper">
              <h1>
                What are <span className="gold title__font">you </span>watching?
              </h1>
              <form className="search__wrapper" onSubmit={handleSubmit}>
                <input
                  type="search"
                  placeholder="Search by Title"
                  className="header__input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn__search" >
                  <FontAwesomeIcon icon="search" />
                </button>
              </form>
              {!valid && <p className="warning">{errorMessage}</p>}
            </div>
          </div>
        </div>
      </section>

      {results ? (
        <section className="search__results">
          <div className="container bgblack">
            <div className="row">
              <div className="results__heading--wrapper bgblack">
                <h2 className="results__title">Search Results:</h2>
                <div className="sort__wrapper">
                  <h3 className="white">Sort By: </h3>
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
                    return <Media media={result} key={result.id} />;
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
