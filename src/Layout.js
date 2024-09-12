import { Link, NavLink, Outlet } from 'react-router-dom';
import React, { useState } from 'react';

const Layout = () => {
  
  const [isOpen, setIsOpen] = useState(false);

  const handleBurgerClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="layout">
      <div className="nav">
        <div className="cont">
          <div className="burger-cont">
            <Link to="/"><img src="/Icons/Logo.png" alt="Goldstone" /></Link>
            <div className={`burger ${isOpen ? 'open' : ''}`} onClick={handleBurgerClick}>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
          </div>
          <ul className={`list ${isOpen ? 'open' : ''}`}>
            <NavLink onClick={handleBurgerClick} to="/">HOME</NavLink>
            <NavLink onClick={handleBurgerClick} to="/about">ABOUT</NavLink>
            <NavLink onClick={handleBurgerClick} to="/eg">EGYPTIAN MATERIALS</NavLink>
            <NavLink onClick={handleBurgerClick} to="/quarries">QUARRIES</NavLink>
            <NavLink onClick={handleBurgerClick} to="/contact">CONTACT</NavLink>
          </ul>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
      <div className="footer">
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="card">
          <img src="/Icons/facebook.png" alt="facebook" />
          <p>Facebook</p>
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="card">
          <img src="/Icons/instagram.png" alt="instagram" />
          <p>Instagram</p>
        </a>
        <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" className="card">
          <img src="/Icons/tiktok.png" alt="tiktok" />
          <p>Tiktok</p>
        </a>
      </div>
    </div>
  );
};

export default Layout;
