import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';
import landingLogo from "../assets/Landing.svg";

const Landing = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search', { state: query });
  }

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
              <span class="gold">Find-It!</span>
            </h2>
            <div className="search__wrapper">
              <input 
              type="search" 
              placeholder="Search by Title" class="landing__input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown} />
              <button 
              class="btn btn__search"
              onClick={handleClick}>
                <FontAwesomeIcon icon="search" />
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
