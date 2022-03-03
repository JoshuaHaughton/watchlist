import React from 'react'
import classes from "./AuthModal/AuthModal.module.css";

const Backdrop = (props) => {
  return (
    <div className={classes.backdrop} onClick={props.closeModal} />
  )
}

export default Backdrop
