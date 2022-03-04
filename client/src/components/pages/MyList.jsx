import React from 'react'

const MyList = () => {
  return (
    <div className="my-list__container">
      <div className="row">
        <div className="my-list__content">
          <div className="my-list__header">
            <h1 className='my-list__title'>My List</h1>
            <p className='my-list__text white'>Browse your list</p>
          </div>
          <div className="my-list__media--content">
            {'render'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyList