import React from 'react'

const Media = () => {
  return (
    <div className="media__card">
      <figure className="media__card--wrapper">
        <img src="" alt="" className="media__card--img"/>
      </figure>
      <div className="media__description">
        <h3 className="media__title">Title</h3>
        <h5 className="media__type">Type (movie or tv and eps)</h5>
        <h5 className="media__rating">Rating</h5>
      </div>
    </div>
  )
}

export default Media
