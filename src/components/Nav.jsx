import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/Logo.svg";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {

  const handleClick = () => {
    alert("Sorry, this is a placeholder. Have a great day!")
  }

  const location = useLocation();
  console.log(location);

  let option = "bgblack";
  let underlineOption = "nav__link link__hover-effect--alt"
  let primaryNav = "nav__link nav__link--primary"
  

  if (location.pathname === '/') {
    
    option = ""
    underlineOption = "nav__link link__hover-effect"
    primaryNav = "nav__link nav__link--primary--alt"

  } 

  const openMenu = () => {
    document.body.classList += " menu--open";
  };

  const closeMenu = () => {
    document.body.classList.remove("menu--open");
  };



  useEffect(() => {
    
    
  }, [])


  return (
    <nav className={option}>
      <div className="nav__container">


        <Link to="/">
          <img src={logo} alt="" className="logo" />
        </Link>


        <ul className="nav__links">


          <li className="nav__list">
            <Link to="/" className={underlineOption}>
              Home
            </Link>
          </li>


          {/* <li className="nav__list">
            <button onClick={handleClick} className={underlineOption}>
              Contact
            </button>
          </li> */}


          <button className="btn__menu" onClick={openMenu}>
            <FontAwesomeIcon icon="bars" />
          </button>


          <li className="nav__list optional__link">
            <Link to="/search" className={primaryNav}>
              Search Movies!
            </Link>
          </li>


        </ul>



        <div className="menu__backdrop">

          <button className="btn__menu btn__menu--close" onClick={closeMenu}>
            <FontAwesomeIcon icon="times" />
          </button>

          <ul className="menu__links">


            <li className="menu__list" onClick={closeMenu}>
              <Link to="/" className="menu__link">
                Home
              </Link>
            </li>

            <li className="menu__list" onClick={closeMenu}>
              <Link to="/search" className="menu__link">
                Search
              </Link>
            </li>


          </ul>



        </div>
      </div>
    </nav>
  );
};

export default Nav;
