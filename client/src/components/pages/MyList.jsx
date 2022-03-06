import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useAuth } from '../contexts/auth-context';
import WatchlistItem from '../ui/WatchlistItem';


const MyList = (props) => {
  const [cookies] = useCookies();
  const [myWatchlist, setMyWatchlist] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const { isLoggedIn } = useAuth();
  


  useEffect(() => {
    const fetchWatchlist = async () => {
      console.log('posting');
      console.log(cookies);
      const response = await axios.get('http://localhost:3001/my-list', {withCredentials: true})
      .catch(err => {
        console.log(err.message);
        setErrorMessage("Please Login to view your list!")
      })

      // const formattedWatchlist = response.data
      console.log(response.data[0]);
      setMyWatchlist(response.data)
      console.log('Actual response from DB', response.data);
      console.log('watchlist: (may be delayed)', myWatchlist);


    }



      fetchWatchlist()
    
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      setErrorMessage("Please Login to view your list!")
    }
  }, [isLoggedIn])

  return (
    <div className="my-list__container">
      <div className="row">
        <div className="my-list__content">

          {errorMessage ? 
          <h1>{errorMessage}</h1> 
          :
          <>
          <div className="my-list__header">
            <h1 className='my-list__title'>My List</h1>
            <p className='my-list__text white'>Browse your list</p>
          </div>
          <div className="my-list__media--content">
            {myWatchlist.length > 0 && 
            myWatchlist.map(media => {
              console.log('item');
              return <WatchlistItem
                media={media}
                key={media.tmdb_id}
                reloadWatchlist={setMyWatchlist}
              />
            })
            }
          </div>
          </> 
          }



        </div>
      </div>
    </div>
  )
}

export default MyList