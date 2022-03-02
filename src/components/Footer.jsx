import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from "../assets/Logo.png"

const Footer = () => {
  const location = useLocation().pathname;
  console.log('footer', location);

  let footerClass = 'footer'
  let footerFadeClass = 'footer__fade';

  if (location === '/') {
    footerFadeClass = 'landing__footer--fade';
    // footerClass = 'landing__footer'
  }

  return (
    <footer className={footerClass}>
      <div className={footerFadeClass}>
      <div className="container">
        <div className="row row__column">
            <figure className="footer__logo">
          <Link to="/">
              <img src={logo} alt="" className="footer__logo--img" />
          </Link>
            </figure>
          <div className="footer__list">
            <Link to="/" className="footer__link">Home</Link>
            <span className="footer__link no-cursor">About</span>
            <Link to="/search" className="footer__link">Search</Link>
            <span className="footer__link no-cursor">Contact</span>
          </div>
          <div className="footer__copyright">
            Copyright &copy; 2022 Find-It!
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}

export default Footer
