import React from "react";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../hooks/useUserContext";
const Navigation = () => {
  const { user, dispatchUser } = useUserContext();
  const username = localStorage.getItem("name");
  console.log(user);
  const logout = () => {
    alert("deconnexion");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    localStorage.removeItem("token");

    localStorage.removeItem("userId");

    dispatchUser({
      type: "LOGOUT",
      payload: { user: { username: "", id: 0, role: "", status: false } },
    });
  };

  return (
    <div className="navigation">
      <p>Bonjour, {username}</p>
      <ul>
        <NavLink to="/login">
          <li onClick={logout}>Logout</li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Navigation;
