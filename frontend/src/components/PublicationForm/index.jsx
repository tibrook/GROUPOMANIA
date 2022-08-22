import React from "react";
import { useState } from "react";
import { postPublication } from "../../requests/publicationRequest";
import Picker from "emoji-picker-react";
// import "../../utils/conf/";
import { usePublicationsContext } from "../../hooks/usePublicationsContext";
import { useUserContext } from "../../hooks/useUserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
const PublicationForm = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const { dispatchPublications } = usePublicationsContext();
  const { user, dispatchUser } = useUserContext();
  /* Envoi du formulaire */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(content);
    if (window.confirm("Voulez-vous publier ? ")) {
      if (content.trim().length === 0 && !image) {
        setError(true);
      } else {
        const regexExp =
          /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
        // console.log(regexExp.test(content));
        if (
          !content.match(/^[a-zA-Z-éÉè',àç_!?:= ]*$/) &&
          !content.match(regexExp)
        ) {
          // console.log("yes");
          setError(true);
        } else {
          const res = await postPublication(image, content);

          if (res.status === 201) {
            dispatchPublications({
              type: "CREATE_PUBLICATION",
              payload: res.data.publi,
            });
            setError(false);
            setImage("");
            setContent("");
          } else {
            setError(true);
          }
        }
      }
    }
    console.log(image);
  };
  const handleDeleteImage = () => {
    if (window.confirm("Voulez-vous supprimer l'image ? ")) {
      setImage("");
    }
    return;
  };
  const handleImage = (e) => {
    console.log(e);
    setError(false);
    setImage(e.target.files[0]);
  };
  /* Emojis */
  const onEmojiClick = (event, emojiObject) => {
    setContent((content) => content + emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <div className="createPostContainer">
      <h1>Créer une publication</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="picker-container">
          <label htmlFor="areaContentForm">Publier votre message</label>
          <textarea
            id="areaContentForm"
            className="input-style"
            value={content}
            onKeyPress={(e) => (e.key === "Enter" ? handleSubmit(e) : null)}
            onChange={(e) =>
              e.key === "Enter" ? null : setContent(e.target.value)
            }
          ></textarea>

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
          <label htmlFor="inputFile" id="label">
            Upload
          </label>

          <input
            type="file"
            id="inputFile"
            name="imageUpload"
            className="imageUpload"
            onChangeCapture={(e) => handleImage(e)}
            accept="image/png, image/jpeg, image/gif"
          />
          {image ? (
            <img src={image.name} className="imgUpload" alt={`${image.name}`} />
          ) : null}
          {image ? (
            <FontAwesomeIcon
              icon={faTrashCan}
              className="delete_image"
              onClick={() => handleDeleteImage()}
            />
          ) : null}
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
