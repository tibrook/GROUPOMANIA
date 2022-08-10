import React from "react";
import { useState } from "react";
import { postPublication } from "../../requests/publicationRequest";
import Picker from "emoji-picker-react";
import "../../utils/conf/";
const PublicationForm = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Voulez-vous publier ? ")) {
      if (content.trim().length === 0 && image.length === 0) {
        setError(true);
      } else {
        const regexExp =
          /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
        console.log(regexExp.test(content));
        if (
          !content.match(/^[a-zA-Z-éÉè',àç_!?:= ]*$/) &&
          !content.match(regexExp)
        ) {
          console.log("yes");
          setError(true);
        } else {
          const res = await postPublication(image, content);
          // console.log(res);
          setError(false);
          setImage("");
          setContent("");
          window.location.reload();
        }
      }
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setContent((content) => content + emojiObject.emoji);
    console.log(content);
    setShowPicker(false);
  };
  return (
    <div className="createPostContainer">
      <h1>Créer une publication</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="picker-container">
          <input
            className="input-style"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <img
            className="emoji-icon"
            alt="emoji picker"
            src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
            onClick={() => setShowPicker((val) => !val)}
          />
          {showPicker && (
            <Picker
              pickerStyle={{ width: "100%" }}
              onEmojiClick={onEmojiClick}
            />
          )}
        </div>

        <div className="footerPubli">
          <input
            type="file"
            name="imageUpload"
            className="imageUpload"
            onChangeCapture={(e) => setImage(e.target.files[0])}
            accept="image/png, image/jpeg, image/gif"
          />
          {error && (
            <p>
              Veuillez Sélectionner au moins une image ou un message, les
              caractères spéciaux ne sont pas acceptés...
            </p>
          )}
          <input type="submit" className="btnEnvoyer" value="Publier" />
        </div>
      </form>
    </div>
  );
};

export default PublicationForm;
