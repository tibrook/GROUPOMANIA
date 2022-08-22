import React, { useState } from "react";
import { login } from "../../requests/userRequest";
import { useUserContext } from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const { user, dispatchUser } = useUserContext(UserContext);
  const [passwordIdVisible, setPasswordIsVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(loginEmail, loginPassword);
    if (response.status === 200) {
      await dispatchUser({
        type: "LOGIN",
        payload: response.data,
      });
    } else {
      setError(true);
      setErrorContent(response.data.error || response.data);
    }
  };

  return (
    <div className="form-container">


      <div className="login-container">
        <div className="login">
          <h1>Se connecter</h1>
          <form className="form-login" onSubmit={(e) => handleLogin(e)}>
            <label htmlFor="email" className="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              required
              onChange={(e) => {
                setLoginEmail(e.target.value);
              }}
            />
            <label htmlFor="password" className="password">
              password
            </label>
            <input
              id="password"
              type={passwordIdVisible ? "text" : "password"}
              placeholder="Mot de passe"
              required
              onChange={(e) => {
                setLoginPassword(e.target.value);
              }}
            />{" "}
            <FontAwesomeIcon
              icon={passwordIdVisible ? faEyeSlash : faEye}
              onClick={() => setPasswordIsVisible((prevState) => !prevState)}
              className="icon_eye icon_eye_login"
            />
            <input type="submit" className="btn_envoyer"
              disabled={
                !loginEmail ||

                  !loginPassword
                  ? true
                  : false
              } value="Se connecter" />
          </form>
        </div>
      </div>
      {error ? <span className="errorContent">{errorContent}</span> : null}

    </div>
  );
};

export default Login;
