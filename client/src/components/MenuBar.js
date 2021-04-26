import React, { useContext, useState, Component } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
const MenuBar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  //login
  const path = pathname == "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item name={user.username} active as={Link} to="/" />
      <Menu.Menu position="right">
        <Menu.Item name="Logout" onClick={(e) => logout()} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={(e) => handleItemClick(e, { name: "home" })}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="Login"
          active={activeItem === "login"}
          onClick={(e) => handleItemClick(e, { name: "login" })}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="Register"
          active={activeItem === "Register"}
          onClick={(e) => handleItemClick(e, { name: "Register" })}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );
  return menuBar;
};

export default MenuBar;
