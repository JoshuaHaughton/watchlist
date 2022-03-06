import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import WatchlistItem from '../ui/WatchlistItem';


const MyList = (props) => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  const [myWatchlist, setMyWatchlist] = useState([]);
  const { isLoggedIn } = props;

  useEffect(() => {
    const fetchWatchlist = async () => {
      console.log('posting');
      const response = await axios.post('http://localhost:3001/my-list', {email: cookies.Email});

      // const formattedWatchlist = response.data
      console.log(response.data[0]);
      setMyWatchlist(response.data)
      console.log('Actual response from DB', response.data);
      console.log('watchlist: (may be delayed)', myWatchlist);


    }
    console.log(isLoggedIn, 'my list here');
    if(isLoggedIn) {
      fetchWatchlist()
    }
  }, [isLoggedIn])

  return (
    <div className="my-list__container">
      <div className="row">
        <div className="my-list__content">
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
              />
            })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyList