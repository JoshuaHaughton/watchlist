import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import placeholder from "../assets/No-Image-Placeholder.svg.png"

const Media = ({media, reloadPage}) => {



  const [detailedMedia, setDetailedMedia] = useState("");


  const yearFormat = (year) => {
    let formattedYear = year;


    //if year has a dash in it, format it with a space to look nicer!
    if (formattedYear.includes("–")) {

      formattedYear = formattedYear.split("–").join(" – ");
      
      //If dash is at the end without an ending year date, format date so it shows "current"
      if (formattedYear.charAt(formattedYear.length-2) === "–") {
        formattedYear = `${formattedYear}Current`
      }
      
    }
    return formattedYear;
  }


  const typeFormat = (type) => {
    let formattedType = type;
    formattedType = formattedType.charAt(0).toUpperCase() + formattedType.slice(1);

    return formattedType;

  }
  


  console.log('IM MEDIA', media);

  useEffect(() => {
    // const getDetails = async () => {
    //   const detailedResponse = await (
    //     await fetch(
    //       `http://www.omdbapi.com/?apikey=420fa557&i=${media.imdbID}`,
    //       )
    //     ).json();

    //   console.log("details", detailedResponse.imdbRating);
    //   setDetailedMedia(detailedResponse);
    // }

    // getDetails();
    // console.log(detailedMedia);
  }, []);

  return (
    <div className="media__card">
      <Link to={`/media/${media.imdbID}`} onClick={reloadPage}>
        <figure className="media__card--wrapper">
          <img src={media.Poster === "N/A" ? placeholder : media.Poster} alt="" className="media__card--img"/>
        </figure>
      </Link>
      <div className="media__description">
        <h3 className="media__title">{media.Title}</h3>
        <h5 className="media__type">{typeFormat(media.Type)}</h5>
        <h5 className="media__year">{yearFormat(media.Year)}</h5>
      </div>
    </div>
  )
}

export default Media
