import { faStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import classes from './Rating.module.css'

export default function Rating( {rating} ) {


  const fullStars = new Array(Math.floor(rating / 2))
  .fill(0)
  .map((_, index) => <FontAwesomeIcon icon="star" key={index}/>)

  let emptyStarsLength = 0;

  if (Number.isInteger(rating / 2)) {
    emptyStarsLength = 5 - (fullStars.length)

  } else {
    emptyStarsLength = 5 - (fullStars.length + 1)
  }

  const emptyStars = new Array(emptyStarsLength).fill(0).map((_, index) => <FontAwesomeIcon icon={faStar} key={index} className='no-click'/>)
  
  


  return (
    <div className={classes.mediaRating}>
        {
          new Array(Math.floor(rating / 2)).fill(0).map((_, index) => <FontAwesomeIcon icon="star" key={index}/>)

        }
        {
          Number.isInteger(rating / 2) ? '' : <FontAwesomeIcon icon="star-half-alt"/>
        }
          {
            emptyStarsLength > 0 && emptyStars
          }
      </div>
  )
}
