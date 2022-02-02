import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Media from "../Media";
import image from "../../assets/Search.svg";

const Search = () => {
  const { state } = useLocation();
  const [searchFor, setSearchFor] = useState(state || "");
  const [query, setQuery] = useState(state || "");
  const [results, setResults] = useState("");
  const [sortValue, setSortValue] = useState("DEFAULT");

  console.log("STATE", state);

  const filterResults = (filter) => {
    console.log(filter);
    setSortValue(filter)
    if (filter === "OLDEST") {
      setResults(
        results
          .slice()
          .sort(
            (a, b) =>
              a.Year - b.Year
          ),
      );
    }

    if (filter === "NEWEST") {
      setResults(
        results
          .slice()
          .sort(
            (a, b) =>
              b.Year -
              a.Year
          ),
      );
    }
    

    if (filter === "TITLE") {
      

      setResults(
        results
        .slice()
        .sort((a, b) => a.Title.localeCompare(b.Title, undefined, { numeric: true, sensitivity: 'base' })),
      );
    }


  }

  const handleClick = () => {
    setSearchFor(query);
    setSortValue("DEFAULT")
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchFor(query);
      setSortValue("DEFAULT");
    }
  }
  useEffect(() => {
    //returns list of movies and shows from OMDapi for given query
    const fetchQueryData = async (query) => {
      if (query !== "") {
        const response = await (
          await fetch(
            `http://www.omdbapi.com/?apikey=420fa557&s=${query}&type=movie&page=1`,
          )
        ).json();

        console.log("PERFORMING SEARCH FOR:", searchFor, query);
        console.log("RESULTS:", response);

        if (response.Response === 'False') {
          console.log("TRY A MORE SPECIFIC SEARCH");
          return
          //RENDER INFO HERE EVENTUALLY
        }

        setResults(response.Search.slice(0, 8));


        return response.Search;
      }
    };

    console.log('SEARCHFOR', searchFor);

    //use function
    fetchQueryData(searchFor);

    //runs on first mount (Initial search if there is one) and whenever the search button is clicked
  }, [searchFor]);

  return (
    <>
      <section id="search__header">
        <div className="container">
          <div className="row">
            <div className="search__header--wrapper">
              <h1>What's on your mind?</h1>
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




     {results ? <section className="search__results">
        <div className="container">
          <div className="row">


            <div className="results__heading--wrapper">
              <h2 className="results__title">Search Results:</h2>
              <div className="sort__wrapper">
                <h3>Sort By: </h3>
                <select id="filter" value={sortValue} onChange={(e) => filterResults(e.target.value)}>
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
              {results.map(result => {
                if (result.Type === "movie") {
                  return <Media media={result}/>
                }
              } )}
              {/* <Media/>
              <Media/>
              <Media/>
              <Media/>
              <Media/> */}

            </div>


          </div>
        </div>

      </section>:
      <figure className="search__img--wrapper">

          <img src={image} alt="" />

        </figure>}
    </>
  );
};


export default Search;
