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

  let history = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(loginEmail, loginPassword);
    if (response.status === 200) {
      dispatchUser({
        type: "LOGIN",
        payload: response.data,
      });
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("role", response.data.role);

      history("/");
    } else {
      setError(true);
      console.log(response);
      setErrorContent(response.data.error || response.data);
    }
    console.log(user);
  };

  return (
    <div className="login-container">
      <div className="login">
        <h3>Se connecter</h3>
        <form className="form-login" onSubmit={(e) => handleLogin(e)}>
          <label htmlFor="email" className="email">
            Email
          </label>
          <input
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
          <input type="submit" value="Se connecter" />
          {error ? <span>{errorContent}</span> : null}
        </form>
      </div>
    </div>
  );
};

export default Login;
