import React, { useState , useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import jwt_decode from 'jwt-decode';
import {MenuItem, } from '@mui/material';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ nom: '' });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: { email?: string;  first_name?:string } = jwt_decode(token);
        setFormData((prevFormData) => ({
          ...prevFormData,
          email: decoded.email || '',
          nom: decoded.first_name || ''
        }));
      } catch (error) {
        console.error('Invalid token', error); 
      }
    }
  }, []);

  const handleLogoutClick = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <input type="checkbox" id="menu-toggle" />

      <div className="sidebar">

        <div className="side-content">

          <div className="profile">
          <div className="profile-img bg-img" style={{ backgroundImage: "url(/img/1.jpeg)" }}></div>

            <h4>{formData.nom}  {formData.prenom}</h4>
            <small>{formData.email}</small>
          </div>

          <div className="side-menu">
            <ul>
              <li>
                <a href="/home" className="active">
                  <span className="las la-home"></span>
                  <small>Home</small>
                </a>
              </li>
              <li>
                <a href="/shop" >
                  <span className="las la-store-alt"></span>
                  <small>Liste Shop</small>
                </a>
              </li>
              <li>
                <a href="/commande" >
                  <span className="las la-store-alt"></span>
                  <small>Liste Commande</small>
                </a>
              </li>
              <li>
                <a href="/coach">
                  <span className="las la-user-graduate"></span>
                  <small>Liste Coach</small>
                </a>
              </li>
              <li>
                <a href="excercice">
                  <span className="las la-clipboard-list"></span>
                  <small>Liste Exsercice</small>
                </a>
              </li>
              <li>
                <a href="/user">
                  <span className="las la-user"></span>
                  <small>Liste User</small>
                </a>
              </li>
              <li>
                <a href="/type">
                  <span className="las la-tasks"></span>
                  <small>Type </small>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isLoggedIn ? (

        <div className="main-content">
          <header>
            <div className="header-content">
              <label htmlFor="menu-toggle">
                <span className="las la-bars"></span>
              </label>
                <div className="header-menu">
                <div style={{border: '1', borderRadius: '1'}}>
                    <MenuItem onClick={() => {
                      handleLogoutClick();
                    }} sx={menuItemStyles}>Logout</MenuItem>
                  </div>
                </div>



            </div>
          </header>
        </div>
        ) : (
          
        <div className="main-content">
          <header>
            <div className="header-content">
              <label htmlFor="menu-toggle">
                <span className="las la-bars"></span>
              </label>
                <div className="header-menu">
                    <div className="user">
                        <span className="las la-power-off"></span>
                        <a onClick={handleLogoutClick}>Login</a>
                    </div>
                </div>
            </div>
          </header>
        </div>
        )}
    </>
  );
}

const menuItemStyles = {
  fontSize: '14px',
  fontWeight: 600,
  '&:hover': {
    color: 'red',
    transform: 'scale(1.1)',
  },
};
export default Navbar;
