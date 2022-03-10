import React, { useState } from "react";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./DeleteItemModal.module.css";
import axios from "axios";

const DeleteItemModalOverlay = (props) => {
  const { mediaId, closeModal, reloadWatchlist } = props;
  const [loading, setLoading] = useState(false);

  const handleDeleteItem = async () => {
    setLoading(true);

    //Delete selected item
    const response = await axios.put(
      "https://watchlist-server1.herokuapp.com/delete-item",
      { mediaId },
      { withCredentials: true },
    );
    closeModal();
    reloadWatchlist(response.data);

    setLoading(false);
  };

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
        <button
          className={`${classes.deleteButton} ${classes.button}`}
          onClick={handleDeleteItem}
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} className={classes.spinner} />
          ) : (
            "Delete"
          )}
        </button>
        <button
          className={`${classes.cancelButton} ${classes.button}`}
          onClick={closeModal}
        >
          Cancel
        </button>
      </footer>
    </div>
  );
};

export default DeleteItemModalOverlay;
