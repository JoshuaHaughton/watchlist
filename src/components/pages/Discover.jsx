import React from 'react'
import MediaList from '../ui/MediaList'

const Discover = () => {
  

  return (
    <section id="discover">
      <div className="container discover__container">
        <div className="discover__row">
          <div className="media__lists">
            <MediaList title="Popular Movies" category="popular"/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Discover