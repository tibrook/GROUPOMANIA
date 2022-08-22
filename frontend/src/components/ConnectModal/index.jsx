import React, { useState } from "react";
import Login from "../Login";
import SignUp from "../SignUp";
import { useUserContext } from "../../hooks/useUserContext";
const ConnectModal = () => {
  const { user, dispatchUser } = useUserContext();

  const [signUp, setSignUp] = useState(user ? false : true);
  // console.log(user);
  // localStorage.getItem("auth") === false ? setSignUp(true) : setSignUp(false);
  return (
    <div className="connect-modal">
      <div className="header-btn">
        <button
          style={{ background: signUp ? "rgb(28,28,28)" : "rgb(83,83,83)" }}
          onClick={() => setSignUp(true)}
        >
          S'inscrire
        </button>
        <button
          style={{ background: signUp ? "rgb(83,83,83)" : "rgb(28,28,28)" }}
          onClick={() => setSignUp(false)}
        >
          Se connecter
        </button>
      </div>
      {!signUp || user ? <Login /> : <SignUp />}
    </div>
  );
};

export default ConnectModal;
