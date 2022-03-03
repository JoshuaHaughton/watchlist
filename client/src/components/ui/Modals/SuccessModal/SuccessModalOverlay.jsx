import React from 'react'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './SuccessModal.module.css'

const SuccessModalOverlay = (props) => {
  return (
    <div className={`${classes.modal} ${classes.card}`}>
      <header className={classes.header}>
        <h2 className={classes.title}>{props.title}</h2>
        <div className={classes.exit} onClick={props.closeModal}>
          <FontAwesomeIcon icon={faTimes} className={classes.exitIcon} />
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.text}>{props.message}</p>
          <br />   
        <p>Have a great day!</p>
      </div>
      <footer className={classes.actions}>
        <button className={classes.button} onClick={props.closeModal}>Okay</button>
      </footer>
    </div>
  )
}

export default SuccessModalOverlay;