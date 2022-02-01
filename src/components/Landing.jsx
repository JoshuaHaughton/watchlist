import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';

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
            <h1>Find your favourite movie today with:
              <br/>
              Find-It!
            </h1>
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
          </div>
        </div>
      </div>
    </section>
  )
}


export default Landing
