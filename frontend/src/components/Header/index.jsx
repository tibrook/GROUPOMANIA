import React from "react";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../hooks/useUserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'
const Navigation = () => {
  const { dispatchUser } = useUserContext();
  const username = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");
  const logout = () => {
    Swal.fire({
      title: 'Se déconnecter ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatchUser({
          type: "LOGOUT",
          payload: { user: null },
        });
      }
    })

  };

  return (
    <div className="navigation">
      <NavLink
        to={{
          pathname: `/user/${userId}`,
        }}
      >
        <FontAwesomeIcon icon={faUser} />{" "}
        <span className="spanUsername">{username}</span>
      </NavLink>
      <ul>
        <NavLink to="/login">
          <FontAwesomeIcon icon={faRightFromBracket} className="faLogout" />
          <li onClick={logout}>Se déconnecter</li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Navigation;
