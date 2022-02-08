import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';
import landingLogo from "../../assets/Landing.svg";

const Landing = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();


  // Navigate to search with whatever input the user put in 
  const handleClick = () => {
    // Shows rotating logo icon for UI 
    setLoading(true)

    if (query.trim().length > 0) {
      setTimeout(() => {
        setLoading(false)
        navigate('/search', { state: query });
      }, 500)
      return;
    }
    setValid(false);
    setLoading(false);
  }

  const handleChange = (e) => {
    setQuery(e.target.value)

    if(e.target.value.trim().length > 0 && !valid) {
      setValid(true)
    }

  }

  //Navigate to search if user presser enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate('/search', { state: query });
    }
  }


  return (
    <section id="landing">
      <div className="container">
        <div className="row">
          <div className="landing__wrapper">
            <h2 className="red">Find your favourite movie today with:
              <br/>
              <span className="gold">Find-It!</span>
            </h2>
            {!valid && <p className="warning">Your search cannot be empty!</p>}
            <div className="search__wrapper">
              <input 
              type="search" 
              placeholder="Search by Title" className="landing__input"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown} />
              <button 
              className="btn btn__search"
              onClick={handleClick}>
                {!loading ? <FontAwesomeIcon icon="search" /> : <FontAwesomeIcon icon="spinner" className="spinner" />}
              </button>
            </div>
            <figure className="landing__img--wrapper">
              <img src={landingLogo} alt="Drawing of girl beside Netflix logo" className="landing__img" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}


export default Landing
