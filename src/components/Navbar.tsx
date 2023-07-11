import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import jwt_decode from "jwt-decode";
import {
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ nom: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: { email?: string; first_name?: string } =
          jwt_decode(token);
        setFormData((prevFormData) => ({
          ...prevFormData,
          email: decoded.email || "",
          nom: decoded.first_name || "",
        }));
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleLogoutClick = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <input type="checkbox" id="menu-toggle" />

          <div className="sidebar">
            <div className="side-content">
              <div className="profile">
                <Avatar
                  className="profile-img bg-img"
                  alt="Profile Pic"
                  src="/img/1.jpeg"
                />

                <h4>
                  {formData.nom}
                </h4>
                <small>{formData.email}</small>
              </div>

              <List>
                <ListItem button component={Link} sx={menuSlideBarStyles} href="/home">
                  <ListItemIcon>
                    <span className="las la-home"></span>
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} sx={menuSlideBarStyles} href="/shop">
                  <ListItemIcon>
                    <span className="las la-store-alt"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Shop" />
                </ListItem>
                <ListItem button component={Link} sx={menuSlideBarStyles} href="/contact">
                  <ListItemIcon>
                    <span className="las la-envelope"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Contact" />
                </ListItem>
                <ListItem button component={Link} sx={menuSlideBarStyles} href="/commande">
                  <ListItemIcon>
                    <span className="las la-shopping-cart"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Commande" />
                </ListItem>
                <ListItem button component={Link} sx={menuSlideBarStyles} href="/coach">
                  <ListItemIcon>
                    <span className="las la-user-graduate"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Coach" />
                </ListItem>
                <ListItem button component={Link} sx={menuSlideBarStyles} href="/excercice">
                  <ListItemIcon>
                    <span className="las la-clipboard-list"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Exsercice" />
                </ListItem>
                <ListItem button component={Link} sx={menuSlideBarStyles} href="/user">
                  <ListItemIcon>
                    <span className="las la-user"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste User" />
                </ListItem>
                <ListItem button component={Link} sx={menuSlideBarStyles} href="/type">
                  <ListItemIcon>
                    <span className="las la-tasks"></span>
                  </ListItemIcon>
                  <ListItemText primary="Type" />
                </ListItem>
              </List>
            </div>
          </div>
          <div className="main-content">
            <header>
              <div className="header-content">
                <label htmlFor="menu-toggle" >
                  <span className="las la-bars" ></span>
                </label>
                <div className="header-menu">
                  <div style={{ border: "1", borderRadius: "1" }}>
                    <MenuItem
                      onClick={() => {
                        handleLogoutClick();
                      }}
                      sx={menuItemStyles}
                    >
                      <LogoutIcon />
                      Logout
                    </MenuItem>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </>
      ) : (
        <>
        </>
      )}
    </>
  );
}

const menuItemStyles = {
  fontSize: "14px",
  fontWeight: 600,
  "&:hover": {
    color: "red",
    transform: "scale(1.1)",
  },
};

const menuSlideBarStyles = {
  fontSize: "14px",
  fontWeight: 600,
  "&:hover": {
    color: "#05b1f0",
    transform: "scale(1.1)",
  },
};

export default Navbar;
