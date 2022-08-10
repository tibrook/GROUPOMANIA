import React, { useRef, useState } from "react";

const SignUp = () => {
  const registerEmail = useRef();
  const registerPassword = useRef();
  const [displayFirstname, setDisplayFirstame] = useState("");
  const [displayLastname, setDisplayLastname] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // try {
    //   auth
    //     .createUserWithEmailAndPassword(
    //       registerEmail.current.value,
    //       registerPassword.current.value
    //     )
    //     .then(async (userAuth) => {
    //       await userAuth.user.updateProfile({
    //         displayName,
    //       });
    //       console.log(userAuth);
    //       window.location.reload();
    //     });
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  return (
    <div className="signup-container">
      <div className="signup">
        <h3>S'inscrire</h3>
        <form onSubmit={(e) => handleRegister(e)}>
          <input
            type="text"
            placeholder="Nom"
            required
            onChange={(e) => e.target.value}
          />
          <input
            type="text"
            placeholder="Prénom"
            required
            onChange={(e) => setDisplayLastname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            ref={registerEmail}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            ref={registerPassword}
            required
          />
          <input type="submit" value="Valider inscription" />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
