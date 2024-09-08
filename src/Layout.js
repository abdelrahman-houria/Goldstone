import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef(null);
  const listRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1150 && menuOpen) {
        setMenuOpen(false);
        burgerRef.current.classList.remove('open');
        listRef.current.classList.remove('open');
      }
    };

    const handleScroll = () => {
      const sticky = window.scrollY > 0;
      setIsSticky(sticky);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    // Set placeholder height
    if (navRef.current) {
      document.documentElement.style.setProperty('--nav-height', `${navRef.current.offsetHeight}px`);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    if (window.innerWidth <= 1150) {
      setMenuOpen(!menuOpen);
      if (!menuOpen) {
        burgerRef.current.classList.add('open');
        listRef.current.classList.add('open');
      } else {
        burgerRef.current.classList.remove('open');
        listRef.current.classList.remove('open');
      }
    }
  };

  const closeMenuOnClick = () => {
    if (window.innerWidth <= 1150 && menuOpen) {
      setMenuOpen(false);
      burgerRef.current.classList.remove('open');
      listRef.current.classList.remove('open');
    }
  };

  return (
    <div className="layout">
      <div className={`nav ${isSticky ? 'sticky' : ''}`} ref={navRef}>
        <div className="cont">
          <Link to="/"><img src="/Icons/Logo.png" alt="Goldstone" /></Link>
          <ul className="list" ref={listRef}>
            <NavLink to="/" onClick={closeMenuOnClick}>HOME</NavLink>
            <NavLink to="about" onClick={closeMenuOnClick}>ABOUT</NavLink>
            <NavLink to="eg" onClick={closeMenuOnClick}>EGYPTIAN MATERIALS</NavLink>
            <NavLink to="quarries" onClick={closeMenuOnClick}>QUARRIES</NavLink>
            <NavLink to="contact" onClick={closeMenuOnClick}>CONTACT</NavLink>
          </ul>
          <div className="burger" ref={burgerRef} onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
      </div>
      <div className="nav-placeholder"></div>
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
