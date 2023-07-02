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
  Typography,
} from "@mui/material";
import Link from "next/link";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ nom: "" });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

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
                  {formData.nom} {formData.prenom}
                </h4>
                <small>{formData.email}</small>
              </div>

              <List>
                <ListItem button component={Link} href="/home">
                  <ListItemIcon>
                    <span className="las la-home"></span>
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} href="/shop">
                  <ListItemIcon>
                    <span className="las la-store-alt"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Shop" />
                </ListItem>
                <ListItem button component={Link} href="/contact">
                  <ListItemIcon>
                    <span className="las la-store-alt"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Contact" />
                </ListItem>
                <ListItem button component={Link} href="/commande">
                  <ListItemIcon>
                    <span className="las la-store-alt"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Commande" />
                </ListItem>
                <ListItem button component={Link} href="/coach">
                  <ListItemIcon>
                    <span className="las la-user-graduate"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Coach" />
                </ListItem>
                <ListItem button component={Link} href="/excercice">
                  <ListItemIcon>
                    <span className="las la-clipboard-list"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste Exsercice" />
                </ListItem>
                <ListItem button component={Link} href="/user">
                  <ListItemIcon>
                    <span className="las la-user"></span>
                  </ListItemIcon>
                  <ListItemText primary="Liste User" />
                </ListItem>
                <ListItem button component={Link} href="/type">
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
                <label htmlFor="menu-toggle">
                  <span className="las la-bars"></span>
                </label>
                <div className="header-menu">
                  <div style={{ border: "1", borderRadius: "1" }}>
                    <MenuItem
                      onClick={() => {
                        handleLogoutClick();
                      }}
                      sx={menuItemStyles}
                    >
                      <span className="las la-power-off"></span>
                      Logout
                    </MenuItem>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </>
      ) : (
        <div className="main-content">
          <header>
            <div className="header-content">
              <div className="header-menu">
                <div className="user">
                  <span className="las la-power-off"></span>
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
  fontSize: "14px",
  fontWeight: 600,
  "&:hover": {
    color: "red",
    transform: "scale(1.1)",
  },
};
export default Navbar;
