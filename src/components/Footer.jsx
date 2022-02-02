import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/Logo.svg"

const Footer = () => {
  return (
    <footer>
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
    </footer>
  )
}

export default Footer
