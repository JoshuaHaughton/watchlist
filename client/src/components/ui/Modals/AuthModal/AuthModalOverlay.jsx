import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import useInputValidate from "../../../hooks/input-validation";
import classes from "./AuthModal.module.css";

const ModalOverlay = (props) => {
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const { isSignUp, setIsSignUp } = props;

  const {
    value: enteredName,
    hasError: nameInputHasError,
    isValid: enteredNameIsValid,
    reset: resetNameInput,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    submitHandler: nameSubmitHandler,
  } = useInputValidate((value) => value.trim() !== "");

  const {
    value: enteredEmail,
    hasError: emailInputHasError,
    isValid: enteredEmailIsValid,
    reset: resetEmailInput,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    submitHandler: emailSubmitHandler,
  } = useInputValidate((value) => {
    return value.trim() !== "" && value.includes("@") && value.includes(".");
  });

  const {
    value: enteredPassword,
    hasError: passwordInputHasError,
    isValid: enteredPasswordIsValid,
    reset: resetPasswordInput,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    submitHandler: passwordSubmitHandler,
  } = useInputValidate((value) => value.trim().length >= 5);

  const {
    value: enteredPasswordConfirm,
    hasError: passwordConfirmInputHasError,
    isValid: enteredPasswordConfirmIsValid,
    reset: resetPasswordConfirmInput,
    valueChangeHandler: passwordConfirmChangeHandler,
    inputBlurHandler: passwordConfirmBlurHandler,
    submitHandler: passwordConfirmSubmitHandler,
  } = useInputValidate(
    (value) => value.trim().length >= 5 && value === enteredPassword,
  );


  const submitHandler = async (e) => {
    e.preventDefault();

    //If Signup Form is enabled
    if (isSignUp) {
      // Sets all input fields to touched on submission so an error comes up if it is invalid
      nameSubmitHandler();
      emailSubmitHandler();
      passwordSubmitHandler();
      passwordConfirmSubmitHandler();

      //If a field is invalid, cancel submission
      if (
        !enteredNameIsValid ||
        !enteredEmailIsValid ||
        !enteredPasswordIsValid ||
        !enteredPasswordConfirmIsValid
      ) {
        return;
      }


      //Else if Login form is enabled
    } else {
      //Login only requires email and password
      emailSubmitHandler();
      passwordSubmitHandler();

      //If a field is invalid, cancel submission
      if (!enteredEmailIsValid || !enteredPasswordIsValid) {
        return;
      }
    }




    //If everything passes validation and works, attempt to submit
    if (isSignUp) {
      //If signup form, attempt to signup
      const response = await axios
        .post("http://localhost:3001/signup", {
          username: enteredName,
          email: enteredEmail,
          password: enteredPassword,
        })
        .catch((res) => {

          //Reset email field and set error to whatever the response error was
          if (res.response.status === 409) {
            resetEmailInput();
            setError(res.response.data);
            return;
          }
        });


      // If response comes back successfull
      const success = response.status == 201;

      if (success) {

        console.log(response.data, 'yaaa');


        setCookie('Username', response.data.username)
        setCookie('Email', response.data.email)
        setCookie('UserId', response.data.userId)
        setCookie('AuthToken', response.data.token)



        resetNameInput();
        resetEmailInput();
        resetPasswordInput();
        resetPasswordConfirmInput();

        props.openSuccessModal();
        props.closeModal();

        //Signed Up!
      }
    } else {
      //If Login form, attempt to Login
    }
  };

  //Toggle form between Signup and Login
  const toggleOption = () => {
    setIsSignUp((prev) => !prev);
  };

  //Change classes of input field if error has been set
  const nameInputClasses = !nameInputHasError
    ? classes.control
    : `${classes.control} ${classes.invalid}`;

  const emailInputClasses = !emailInputHasError
    ? classes.control
    : `${classes.control} ${classes.invalid}`;

  const passwordInputClasses = !passwordInputHasError
    ? classes.control
    : `${classes.control} ${classes.invalid}`;

  const passwordConfirmInputClasses = !passwordConfirmInputHasError
    ? classes.control
    : `${classes.control} ${classes.invalid}`;

  //Reset overall form error when email is changed
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [enteredEmail]);



  return (
    <div className={`${classes.modal} ${classes.card}`}>
      <header className={classes.header}>
        <h2 className={classes.title}>{isSignUp ? "Sign Up" : "Log In"}</h2>
        <div className={classes.exit} onClick={props.closeModal}>
          <FontAwesomeIcon icon={faTimes} className={classes.exitIcon} />
        </div>
      </header>

      <div className={classes.content}>
        <div className={classes.row}>
          <form className={classes.form} onSubmit={submitHandler}>
            {isSignUp && (
              <div className={nameInputClasses}>
                <input
                  type="username"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  onChange={nameChangeHandler}
                  onBlur={nameBlurHandler}
                  value={enteredName}
                />
                {nameInputHasError && (
                  <p className={classes.errorText}>Username can't be empty</p>
                )}
              </div>
            )}
            <div className={emailInputClasses}>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
                value={enteredEmail}
              />
              {emailInputHasError && (
                <p className={classes.errorText}>
                  Please enter a valid Email Address
                </p>
              )}
            </div>
            <div className={passwordInputClasses}>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                onChange={passwordChangeHandler}
                onBlur={passwordBlurHandler}
                value={enteredPassword}
              />
              {passwordInputHasError && (
                <p className={classes.errorText}>
                  Password must be at least 5 characters long
                </p>
              )}
            </div>
            {isSignUp && (
              <div className={passwordConfirmInputClasses}>
                <input
                  type="password"
                  id="password-confirmation"
                  name="password-confirmation"
                  placeholder="Confirm your Password"
                  onChange={passwordConfirmChangeHandler}
                  onBlur={passwordConfirmBlurHandler}
                  value={enteredPasswordConfirm}
                />
                {passwordConfirmInputHasError && (
                  <p className={classes.errorText}>
                    Passwords must be valid and match
                  </p>
                )}
              </div>
            )}

            <button className={classes.button}>
              {isSignUp ? `Sign Up` : `Log In`}
            </button>
            {error && <p className={classes.formError}>{error}</p>}
          </form>
          
        </div>
        <div className={classes.option}>
          <p>{isSignUp ? `Not signing up?` : `Not logging in?`} </p>
          <div className={classes.toggle} onClick={toggleOption}>
            {isSignUp ? `Log In` : `Sign Up`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;
