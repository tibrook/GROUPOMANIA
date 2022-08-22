import React from "react";
import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <NavLink to="/" >
      <div className="logo" aria-hidden="true">
      </div>
      <span className="sr-only">Home</span>
    </NavLink>

  );
};

export default Logo;
