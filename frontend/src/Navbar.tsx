import { NavLink } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  return (
    <nav className="app-navbar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "bt-nav active" : "bt-nav")}
      >
        Home
      </NavLink>
      <NavLink
        to="/favorites"
        className={({ isActive }) => (isActive ? "bt-nav active" : "bt-nav")}
      >
        Favorites
      </NavLink>
      <NavLink
        to="/applications"
        className={({ isActive }) => (isActive ? "bt-nav active" : "bt-nav")}
      >
        Applications
      </NavLink>
    </nav>
  );
};
