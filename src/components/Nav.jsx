import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/Logo.svg";
import { Link, useLocation } from "react-router-dom";
import { closeMenu, openMenu } from "./helpers/NavHelpers";

const Nav = () => {
  const location = useLocation();
  let option = "bgblack";
  let underlineOption = "nav__link link__hover-effect--alt";
  let primaryNav = "nav__link nav__link--primary";

  //If the current pathname is the index, render the alternate coloour theme for the nav
  if (location.pathname === "/") {
    option = "";
    underlineOption = "nav__link link__hover-effect";
    primaryNav = "nav__link nav__link--primary--alt";
  }

  return (
    <nav className={option}>
      <div className="nav__container">
        <Link to="/">
          <img src={logo} alt="" className="logo" />
        </Link>

        <ul className="nav__links">
          <li className="nav__list">
            <Link to="/" className={"nav__link link__hover-effect"}>
              HOME
            </Link>
          </li>

          <button className="btn__menu" onClick={openMenu}>
            <FontAwesomeIcon icon="bars" />
          </button>


          <li className="nav__list optional__link">
            <Link to="/search" className={"nav__link link__hover-effect"}>
              SEARCH
            </Link>
          </li>

          
          <li className="nav__list optional__link">
            <Link to="/discover" className={"nav__link nav__link--primary"}>
              DISCOVER
            </Link>
          </li>


          {/* <li className="nav__list optional__link">
            <Link to="/search" className={underlineOption}>
              MY LIST
            </Link>
          </li> */}
        </ul>

        <div className="menu__backdrop">
          <button className="btn__menu btn__menu--close" onClick={closeMenu}>
            <FontAwesomeIcon icon="times" />
          </button>

          <ul className="menu__links">
            <li className="menu__list" onClick={closeMenu}>
              <Link to="/" className="menu__link">
              <span className="gold">Home</span>
              </Link>
            </li>

            <li className="menu__list" onClick={closeMenu}>
              <Link to="/search" className="menu__link">
                <span className="red">Search</span>
              </Link>
            </li>

            <li className="menu__list" onClick={closeMenu}>
              <Link to="/discover" className="menu__link">
                <span className="red">Discover</span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
