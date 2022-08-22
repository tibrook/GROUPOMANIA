import React from "react";
import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <NavLink to="/" >
      <div className="logo" aria-hidden="true">
        {/* <img src="" alt="Logo Groupomania" /> */}
        {/* <h3>Groupomania</h3> */}
      </div>
      <span className="sr-only">Home</span>
    </NavLink>

  );
};

export default Logo;
