import React from 'react'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './DeleteItemModal.module.css'
import axios from 'axios';
import { useCookies } from 'react-cookie';

const DeleteItemModalOverlay = (props) => {
  const { mediaId, closeModal, reloadWatchlist } = props;
  const [cookies] = useCookies()

  const handleDeleteItem = async () => {
    //Need to remember to Rerender mylist component!!!!!!

    console.log('id for deletion', mediaId);
    console.log('initiating backend delete');

    const response = await axios.put('http://localhost:3001/delete-item', { email: cookies.Email, mediaId});
    console.log(response);
    console.log(response.data);
    closeModal()
    reloadWatchlist(response.data)
  }
  
  return (
    <div className={`${classes.modal} ${classes.card}`}>
      <header className={classes.header}>
        <h2 className={classes.title}>{props.title}</h2>
        <div className={classes.exit} onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} className={classes.exitIcon} />
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.text}>{props.message}</p>
          <br />   
      </div>
      <footer className={classes.actions}>
        <button className={`${classes.deleteButton} ${classes.button}`} onClick={handleDeleteItem}>Delete</button>
        <button className={`${classes.cancelButton} ${classes.button}`} onClick={closeModal}>Cancel</button>
      </footer>
    </div>
  )
}

export default DeleteItemModalOverlay;