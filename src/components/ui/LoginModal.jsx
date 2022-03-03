import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import classes from "./LoginModal.module.css";




const submitHandler = (e) => {
  e.preventDefault();

}

//Backrop and ModalOverlay created here since I don't use them on any other component
const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.closeModal} />;
};

const ModalOverlay = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true)

  const toggleOption = () => {
    setIsSignUp(prev => !prev)
  }
  

  return (
    <div className={`${classes.modal} ${classes.card}`}>
      <header className={classes.header}>
        <h2 className={classes.title}>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
        <div className={classes.exit} onClick={props.closeModal}>
          <FontAwesomeIcon icon={faTimes}/>
        </div>
      </header>


      <div className={classes.content}>
        <div className={classes.row}>
          {/* <h2 className={classes.title}>{isSignUp ? 'Sign Up' : 'Log In'}</h2> */}
          {/* <p>{isSignUp ? 'By clicking SignUp, you agree to the terms and conditions of Watchlist (To have a great time)' : 'Welcome back to WatchList. Please remember to follow our terms of having a good time!'}</p> */}
          <form className={classes.form} onSubmit={submitHandler}>

            <input 
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required={true}
              onChange={e => setEmail(e.target.value)}
              />
            <input 
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              required={true}
              onChange={e => setPassword(e.target.value)}
              />
            {isSignUp && <input 
              type="password-confirmation"
              id="password-confirmation"
              name="password-confirmation"
              placeholder="Confirm your Password"
              required={true}
              onChange={e => setConfirmPassword(e.target.value)}
              />}

              <button className={classes.button}>{isSignUp ? `Sign Up` : `Log In`}</button>
              <p>{error && error}</p>

          </form>
        </div>
      <div className={classes.option}>
        <p>{isSignUp ? `Not signing up?` : `Not logging in?`} </p>
        <div className={classes.toggle} onClick={toggleOption}>{isSignUp ? `Log In` : `Sign Up`}</div>
      </div>
      </div>


      {/* <footer className={classes.actions}>
        <button className={classes.button} onClick={props.closeModal}>Okay</button>
      </footer> */}
    </div>
  );
};

const LoginModal = (props) => {
  return (
    <>
      {createPortal(
        <Backdrop closeModal={props.closeModal} />,
        document.getElementById("backdrop-root"),
      )}
      {createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          closeModal={props.closeModal}
        />, document.getElementById('overlay-root')
      )}
    </>
  );
};

export default LoginModal;
