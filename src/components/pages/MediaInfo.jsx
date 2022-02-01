import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Media from "../Media";

const MediaInfo = ({media}) => {
  let location = useLocation().pathname;
  let param = location.split('/')
  let id = param[param.length-1];
  let emptyArray = [0, 0, 0, 0]

  


  const [myMedia, setMyMedia] = useState(media || '');
  const [relatedMedia, setRelatedMedia] = useState("");


  useEffect(() => {

    //CURRENT MOVIE PAGE
    const getDetails = async () => {
      console.log('MY LOCATION IS ', id);
      const detailedResponse = await (
        await fetch(
          `http://www.omdbapi.com/?apikey=420fa557&i=${id}`,
          )
        ).json();
  
        if (detailedResponse.Response === 'False') {
          console.log("You haven't entered a valid imdbId!");
          return;
        }
  
        console.log("details", detailedResponse);
        setMyMedia(detailedResponse)








        // RECOMMENDED MEDIA 





        let shortTitle = detailedResponse.Title
        if (detailedResponse.Title.split(" ").length > 3) {
          shortTitle = `${detailedResponse.Title.split(" ")[0]} ${detailedResponse.Title.split(" ")[1]} ${detailedResponse.Title.split(" ")[2]}`
          console.log('SHORT TITLE', shortTitle);

        }

        const relatedDetailedResponse = await (
        await fetch(
          `http://www.omdbapi.com/?apikey=420fa557&s=${shortTitle}&type=movie`,
          )
        ).json();
  
        if (relatedDetailedResponse.Response === 'False') {
          console.log("rrrr You haven't entered a valid imdbId!");
          return;
        }

        console.log("RELATED", relatedDetailedResponse);

        const noDuplicates = relatedDetailedResponse.Search.filter(
          (media) => media.imdbID !== myMedia.imdbID
        )

        console.log("RELATED WITH NO DUPLICATES", noDuplicates);

        if (noDuplicates.length > 0) {
          setRelatedMedia(noDuplicates);
        }
        
        // return noDuplicates;
  
  
  
      // setDetailedMedia(detailedResponse);
    }


    getDetails();
    // console.log(detailedMedia);
  }, [myMedia]);

  return (
    <div id="media__body">
      <main id="media__main">
        <div className="media__container">
          <div className="row">
            <div className="media__selected--top">
              <Link to="/search" className="media__link">
                <FontAwesomeIcon icon="arrow-left" />
              </Link>
              <Link to="/search" className="media__link">
                <h2 className="media__selected--title--top">Back to Search</h2>
              </Link>
            </div>
            <div className="media__selected">
              <figure className="media__selected--figure">
                <img
                  src={media ? media.Poster : myMedia.Poster}
                  alt=""
                  className="media__selected--img"
                />
              </figure>
              <div className="media__selected--description">
                <h2 className="media__selected--title">{myMedia.Title} - {myMedia.Year}</h2>
                {/* <Rating rating= /> */}
                  <h3 className="media__summary--title">Rating: {myMedia.imdbRating} - ({myMedia.Rated})</h3>
                  <h3 className="media__summary--title">Genres:  {myMedia.Genre}</h3>
                  <br/>
                  
                  <h3 className="media__summary--title">Actors: </h3>
                  <p className="media__summary--para">
                    {myMedia.Actors}
                  </p>
                <div className="media__summary">
                  <h3 className="media__summary--title">Summary</h3>
                  <p className="media__summary--para">
                    {myMedia.Plot}
                  </p>
                </div>
                {(
                  <a href={`https://m.imdb.com/title/${id}/`} target="_blank"> <button className="btn">More Details</button></a>
                )}
              </div>
            </div>
          </div>
        </div>





        <div className="media__container">
          <div className="row">
            <div className="media__selected--top">





              <h2 className="media__selected--title--top">
                You may also like:
              </h2>
            </div>
            <div className="media">


              {relatedMedia && relatedMedia
                .slice(0, 4)
                .map((media) => {
                  console.log("passed", media);
                  return <Media media={media} key={media.imdbId} />})
                }


            </div>


          </div>
        </div>
      </main>
    </div>
  )
}

export default MediaInfo
