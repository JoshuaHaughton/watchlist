import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/Logo.svg";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  // const openMenu = () => {
  //   document.body.classList += " menu--open";
  // };

  // const closeMenu = () => {
  //   document.body.classList.remove("menu--open");
  // };

  const handleClick = () => {
    alert("Sorry, this is a placeholder. Have a great day!")
  }

  const location = useLocation();
  console.log(location);

  let option = "bgblack";
  let underlineOption = "nav__link link__hover-effect--alt"
  

  if (location.pathname === '/') {
    
    option = ""
    underlineOption = "nav__link link__hover-effect"

  } 

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


          <li className="nav__list">
            <Link to="/search" className={underlineOption}>
              Search Movies
            </Link>
          </li>


          <button className="btn__menu">
            <FontAwesomeIcon icon="bars" />
          </button>


          <li className="nav__list">
            <button onClick={handleClick} className="nav__link
            nav__link--primary">
              Contact
            </button>
          </li>


        </ul>



        <div className="menu__backdrop">

          <button className="btn__menu btn__menu--close">
            <FontAwesomeIcon icon="times" />
          </button>

          <ul className="menu__links">


            <li className="menu__list">
              <Link to="/" className="menu__link">
                Home
              </Link>
            </li>

            <li className="menu__list">
              <Link to="" className="menu__link">
                Search
              </Link>
            </li>

            <li className="menu__list">
              <Link to="" className="menu__link">
                Contact
              </Link>
            </li>


          </ul>



        </div>
      </div>
    </nav>
  );
};

export default Nav;
