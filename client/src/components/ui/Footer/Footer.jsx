import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/Logo.svg";
import { useAuth } from "../../contexts/auth-context";
import classes from "./Footer.module.css";

const Footer = () => {
  const location = useLocation().pathname;
  const { isLoggedIn } = useAuth();

  let footerClass = classes.footer;
  let footerFadeClass = classes.footerFade;

  if (location === "/") {
    footerFadeClass = classes.landingFooterFade;
  }

  return (
    <footer className={footerClass}>
      <div className={footerFadeClass}>
        <div className={classes.container}>
          <div className={classes.row}>
            <figure className={classes.footerLogo}>
              <Link to="/">
                <img src={logo} alt="" className={classes.footerLogoImg} />
              </Link>
            </figure>
            <div className={classes.footerList}>
              <Link to="/" className={classes.footerLink}>
                Home
              </Link>
              {/* <span className="footer__link no-cursor">About</span> */}
              <Link to="/search" className={classes.footerLink}>
                Search
              </Link>
              <Link to="/discover" className={classes.footerLink}>
                Discover
              </Link>
              {isLoggedIn && (
                <Link to="/my-list" className={classes.footerLink}>
                  My List
                </Link>
              )}
              {/* <span className="footer__link no-cursor">Contact</span> */}
            </div>
            <div className={classes.footerCopyright}>
              Copyright &copy; 2022 WatchList!
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
