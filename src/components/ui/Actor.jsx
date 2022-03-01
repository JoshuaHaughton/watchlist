import React from 'react'

const Actor = ({name, character, src}) => {
  return (
    <div className='actor__wrapper'>
      <figure className='actor__img--wrapper'>
        <img src={src} alt='actor-thumbnail' className='actor__img'/>
      </figure>
      <h3 className='actor__name white'>{name}</h3>
      <p className='actor__character white'>{character}</p>
    </div>
  )
}

export default Actor