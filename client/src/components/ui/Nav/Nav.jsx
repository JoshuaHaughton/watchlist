import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/Logo.svg";
import { Link, useLocation } from "react-router-dom";
import { closeMenu, openMenu } from "./NavHelpers";
import AuthModal from "../Modals/AuthModal/AuthModal";
import SuccessModal from "../Modals/SuccessModal/SuccessModal";
import { useAuth } from "../../contexts/auth-context";
import classes from "./Nav.module.css";

const Nav = () => {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { isLoggedIn, setIsLoggedIn, logout, checkServerIfLogged } = useAuth();

  const location = useLocation();


  const openAuthModalHandler = () => {
    setOpenAuthModal(true);
  };

  const closeAuthModalHandler = () => {
    setOpenAuthModal(false);
  };

  const openSuccessModalHandler = () => {
    setOpenSuccessModal(true);
  };

  const closeSuccessModalHandler = () => {
    setOpenSuccessModal(false);
  };

  const logoutHandler = async () => {
    await logout();
    setIsLoggedIn(false);
  };

  const navLoginHandler = async () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    //Check backend to see if JWT token held in user's httpOnly cookie is still valid
    checkServerIfLogged();
  }, [location]);

  return (
    <>
      {openSuccessModal && (
        <SuccessModal
          title={isSignUp ? "Sign Up Successful!" : "Log In Successful!"}
          message={
            isSignUp
              ? "Thank you for signing up!"
              : "Welcome Back! Login Successful."
          }
          closeModal={closeSuccessModalHandler}
          openModal={openSuccessModalHandler}
          isSignUp={isSignUp}
        />
      )}
      {openAuthModal && (
        <AuthModal
          title={"test title"}
          message={"test message"}
          closeModal={closeAuthModalHandler}
          openSuccessModal={openSuccessModalHandler}
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          navLogin={navLoginHandler}
        />
      )}
      <nav className={classes.bgBlack}>
        <div className={classes.container}>
          <Link to="/">
            <img src={logo} alt="" className={classes.logo} />
          </Link>

          <ul className={classes.navLinks}>
            <li className={classes.navList}>
              <Link
                to="/"
                className={`${classes.navLink} ${classes.hoverEffect}`}
              >
                HOME
              </Link>
            </li>

            <button className={classes.mobileMenuButton} onClick={openMenu}>
              <FontAwesomeIcon icon="bars" />
            </button>

            <li className={classes.navList}>
              <Link
                to="/search"
                className={`${classes.navLink} ${classes.hoverEffect}`}
              >
                SEARCH
              </Link>
            </li>

            <li className={classes.navList}>
              <Link
                to="/discover"
                className={`${classes.navLink} ${classes.hoverEffect}`}
              >
                DISCOVER
              </Link>
            </li>

            {!isLoggedIn && (
              <li className={classes.navList}>
                <div
                  className={classes.navLinkPrimary}
                  onClick={openAuthModalHandler}
                >
                  REGISTER/LOGIN
                </div>
              </li>
            )}

            {isLoggedIn && (
              <>
                <li className={classes.navList}>
                  <Link
                    to="/my-list"
                    className={`${classes.navLink} ${classes.hoverEffect}`}
                  >
                    MY LIST
                  </Link>
                </li>

                <li className={classes.navList}>
                  <div
                    className={classes.navLinkPrimary}
                    onClick={logoutHandler}
                  >
                    LOGOUT
                  </div>
                </li>
              </>
            )}
          </ul>

          <div className={classes.menuBackdrop}>
            <button
              className={`${classes.mobileMenuButton} ${classes.mobileMenuButtonClose}`}
              onClick={closeMenu}
            >
              <FontAwesomeIcon icon="times" />
            </button>

            <ul className={classes.menuLinks}>
              <li className={classes.menuList} onClick={closeMenu}>
                <Link to="/" className={classes.menuLink}>
                  <span className={classes.gold}>Home</span>
                </Link>
              </li>

              <li className={classes.menuList} onClick={closeMenu}>
                <Link to="/search" className={classes.menuLink}>
                  <span className={classes.red}>Search</span>
                </Link>
              </li>

              <li className={classes.menuList} onClick={closeMenu}>
                <Link to="/discover" className={classes.menuLink}>
                  <span className={classes.red}>Discover</span>
                </Link>
              </li>

              {isLoggedIn && (
                <li className={classes.menuList} onClick={closeMenu}>
                  <Link to="/my-list" className={classes.menuLink}>
                    <span className={classes.red}>My List</span>
                  </Link>
                </li>
              )}

              {isLoggedIn && (
                <li className={classes.menuList} onClick={closeMenu}>
                  <div
                    className={classes.navLinkPrimary}
                    onClick={logoutHandler}
                  >
                    Logout
                  </div>
                </li>
              )}

              {!isLoggedIn && (
                <li className={classes.menuList} onClick={closeMenu}>
                  <div
                    className={classes.navLinkPrimary}
                    onClick={openAuthModalHandler}
                  >
                    Register / Login
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
