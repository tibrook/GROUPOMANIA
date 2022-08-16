import React, { useState } from "react";
import { signup, login } from "../../requests/userRequest";
import { useUserContext } from "../../hooks/useUserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEye,
  faEyeSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [displayFirstname, setDisplayFirstame] = useState("");
  const [displayLastname, setDisplayLastname] = useState("");
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const { user, dispatchUser } = useUserContext();
  const [passwordIdVisible, setPasswordIsVisible] = useState(false);
  const passwordHasValidLength = registerPassword.length >= 8;
  const passwordHasLowercaseLetter = /[a-z]/.test(registerPassword);
  const passwordHasUppercaseLetter = /[A-Z]/.test(registerPassword);
  const passwordHasSpecialCharacter =
    /[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/.test(registerPassword);
  const passwordHasNumber = /[0-9]/.test(registerPassword);
  const emailIsValid = /^[\w_\.-]+@groupomania.fr/.test(registerEmail);
  const passwordIsValid =
    passwordHasValidLength &&
    passwordHasLowercaseLetter &&
    passwordHasSpecialCharacter &&
    passwordHasUppercaseLetter &&
    passwordHasNumber;
  let history = useNavigate();
  const firstnameIsValid =
    /^[a-zA-Z\-éÉèç ]*$/.test(displayFirstname) &&
    displayFirstname.trim() !== "";
  const lastnameIsValid =
    /^[a-zA-Z\-éÉèç ]*$/.test(displayLastname) && displayLastname.trim() !== "";
  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await signup(
      registerEmail,
      registerPassword,
      displayFirstname,
      displayLastname
    );
    if (response.status !== 201) {
      console.log(response);
      setError(true);
      alert(response);
      // setErrorContent(response);
    } else {
      dispatchUser({
        type: "REGISTER",
        payload: { auth: true },
      });
      const response = await login(registerEmail, registerPassword);
      if (response.status === 200) {
        console.log(response);
        dispatchUser({
          type: "LOGIN",
          payload: response.data,
        });
        await localStorage.setItem("userId", response.data.userId);
        await localStorage.setItem("token", response.data.token);
        await localStorage.setItem("name", response.data.name);
        await localStorage.setItem("role", response.data.role);

        history("/");
      } else {
        setError(true);
        setErrorContent(response.data.error);
      }

      // console.log(user);
      console.log(response);
      setError(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup">
        <h3>S'inscrire</h3>
        <form onSubmit={(e) => handleRegister(e)} className="signupForm">
          <div className="labelForm">
            <label htmlFor="name" className="inscription_label_nom">
              Nom :{" "}
            </label>
            <label htmlFor="prenom" className="inscription_label_prenom">
              prenom :{" "}
            </label>
            <label htmlFor="email" className="inscription_label_email">
              email :{" "}
            </label>
            <label htmlFor="password" className="inscription_label_password">
              password :{" "}
            </label>
          </div>
          <div className="contentForm">
            <input
              id="name"
              type="text"
              placeholder="Nom"
              title="Veuillez saisir votre nom. 
            Le nom ne doit pas contenir de catactères spéciaux"
              required
              onChange={(e) => setDisplayFirstame(e.target.value)}
              style={{
                border: firstnameIsValid ? "1px solid green" : "1px solid red",
              }}
            />
            <input
              id="prenom"
              type="text"
              placeholder="Prénom"
              title="Veuillez saisir votre prénom. 
            Le prénom ne doit pas contenir de catactères spéciaux"
              required
              onChange={(e) => setDisplayLastname(e.target.value)}
              style={{
                border: lastnameIsValid ? "1px solid green" : "1px solid red",
              }}
            />
            <input
              id="email"
              type="email"
              placeholder="Email"
              title="L'email doit être au format suivant : ****@groupomania.fr"
              required
              onChange={(e) => setRegisterEmail(e.target.value)}
              defaultValue="@groupomania.fr"
              style={{
                border: emailIsValid ? "1px solid green" : "1px solid red",
              }}
            />
            <div className="passwordWrapper">
              <input
                id="password"
                type={passwordIdVisible ? "text" : "password"}
                placeholder="Mot de passe"
                title="Veuillez saisir un mot de passe valide"
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                style={{
                  border: passwordIsValid ? "1px solid green" : "1px solid red",
                }}
              />
              {registerPassword.length > 0 ? (
                <FontAwesomeIcon
                  icon={passwordIdVisible ? faEyeSlash : faEye}
                  onClick={() =>
                    setPasswordIsVisible((prevState) => !prevState)
                  }
                  className="icon_eye"
                />
              ) : null}
            </div>

            <input
              type="submit"
              value="Valider inscription"
              disabled={
                !passwordIsValid ||
                !firstnameIsValid ||
                !emailIsValid ||
                !lastnameIsValid
                  ? true
                  : false
              }
            />
          </div>
        </form>
        {registerPassword.length > 0 ? (
          <ul>
            <li>
              One lowercase letter
              <FontAwesomeIcon
                icon={!passwordHasLowercaseLetter ? faXmark : faCheck}
                className={!passwordHasLowercaseLetter ? "faXmark" : "faCheck"}
              />
            </li>
            <li>
              One Uppercase letter
              <FontAwesomeIcon
                icon={!passwordHasUppercaseLetter ? faXmark : faCheck}
                className={!passwordHasUppercaseLetter ? "faXmark" : "faCheck"}
              />
            </li>
            <li>
              One special letter
              <FontAwesomeIcon
                icon={!passwordHasSpecialCharacter ? faXmark : faCheck}
                className={!passwordHasSpecialCharacter ? "faXmark" : "faCheck"}
              />
            </li>
            <li>
              One number
              <FontAwesomeIcon
                icon={!passwordHasNumber ? faXmark : faCheck}
                className={!passwordHasNumber ? "faXmark" : "faCheck"}
              />
            </li>
            <li>
              At lest 8 caracthers
              <FontAwesomeIcon
                icon={!passwordHasValidLength ? faXmark : faCheck}
                className={!passwordHasValidLength ? "faXmark" : "faCheck"}
              />
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default SignUp;
