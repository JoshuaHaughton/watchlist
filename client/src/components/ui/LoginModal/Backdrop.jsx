import React from 'react'
import classes from "./LoginModal.module.css";

const Backdrop = (props) => {
  return (
    <div className={classes.backdrop} onClick={props.closeModal} />
  )
}

export default Backdrop
