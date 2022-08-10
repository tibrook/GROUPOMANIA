import React from "react";
import { useState } from "react";
import { postPublication } from "../../requests/publicationRequest";
const PublicationForm = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("Voulez-vous publier ? ")) {
      if (content.trim().length === 0 && image.length === 0) {
        setError(true);
      } else {
        const res = postPublication(image, content);
        console.log(res);
        setError(false);
        setImage("");
        setContent("");
        // window.location.reload();
      }
    }
  };

  return (
    <div className="createPostContainer">
      <h1>Créer une publication</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <textarea
          placeholder="Message"
          onChangeCapture={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="footerPubli">
          <input
            type="file"
            name="imageUpload"
            className="imageUpload"
            onChangeCapture={(e) => setImage(e.target.files[0])}
            accept="image/png, image/jpeg"
          />
          {error && (
            <p>Veuillez Sélectionner au moins une image ou un message</p>
          )}
          <input type="submit" className="btnEnvoyer" value="Publier" />
        </div>
      </form>
    </div>
  );
};

export default PublicationForm;
