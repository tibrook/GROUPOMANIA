import { userIdApi } from "../../utils/conf";
import Like from "../Like";
import React from "react";
import { useState } from "react";
import {
  suppressionPublication,
  modifyPublication,
} from "../../requests/publicationRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
const Publication = ({ publication, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditConent] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isEditingMenu, setEditingMenu] = useState(false);
  const handleDelete = async () => {
    await suppressionPublication(publication._id);
    window.location.reload();
  };
  const creationDate = (date) => {
    let response;

    const secondes = Math.floor((Date.now() - new Date(date).valueOf()) / 1000);
    let hours = Math.floor(secondes / 3600);
    let minutes = Math.floor((secondes % 3600) / 60);
    let seconde = Math.floor((secondes % 3600) % 60);
    let jours = Math.floor((hours / 24) % 60);

    if (secondes <= 59) {
      response = `${secondes} ${secondes > 1 ? "secondes" : "seconde"}`;
    } else if (secondes > 59 && secondes < 3600) {
      response = `${minutes} ${
        minutes > 1 ? "minutes" : "minute"
      } et ${seconde} ${seconde > 1 ? "secondes" : "seconde"}`;
    } else if (secondes > 3599 && secondes < 86400) {
      response = `${hours} ${hours > 1 ? "heures" : "heure"} et ${minutes} ${
        minutes > 1 ? "minutes" : "minute"
      }`;
    } else if (hours >= 24) {
      response = `${jours} ${jours > 1 ? "jours" : "jour"}`;
    }

    return response;
  };

  const handleEdit = () => {
    console.log(publication.content);
    console.log(editImage);
    if (
      editContent.trim().length === 0 &&
      publication.content.trim().length === 0 &&
      !editImage &&
      !publication.imageUrl
    ) {
      alert("Il faut au moins un message ou une image");
      return;
    }
    setIsEditing(false);
    modifyPublication(publication._id, editContent, editImage);
    // window.location.reload();
  };
  const handleEditMenu = () => {
    if (!isEditingMenu) {
      setEditingMenu(true);
    } else {
      setEditingMenu(false);
    }
  };
  return (
    <div
      className={`cardWrapper d` + (index + 1)}
      style={{
        background: isEditing ? "#FFD7D7" : "#4E5166",
        color: isEditing ? "black" : "white",
      }}
    >
      <div className="headerPubli">
        <span className="authorPubli">{publication.author}</span>
        <span className="dateCreation">
          Posté il y a {creationDate(publication.createdAt)}
        </span>
        <FontAwesomeIcon
          className={publication.userId === userIdApi ? "faBars" : "faHidden"}
          icon={faBars}
          onClick={handleEditMenu}
        />
      </div>
      <div className={isEditingMenu ? "menuEditing" : "menuEditing menuHidden"}>
        <ul>
          {isEditing ? (
            <li className="liValid" onClick={() => handleEdit()}>
              Valider
            </li>
          ) : (
            <li className="liModif" onClick={() => setIsEditing(true)}>
              Modifier
            </li>
          )}
          <li className="liSuppr" onClick={() => handleDelete()}>
            Supprimer
          </li>
        </ul>
      </div>
      {isEditing ? (
        <textarea
          defaultValue={publication.content}
          autoFocus
          onChange={(e) => setEditConent(e.target.value)}
        ></textarea>
      ) : (
        <span className={publication.content ? "publicationContent" : "null"}>
          {editContent ? editContent : publication.content}
        </span>
      )}
      <img
        src={editImage ? editImage.name : publication.imageUrl}
        alt={editImage ? editImage.name : publication.imageUrl}
      />
      {isEditing ? (
        <input
          type="file"
          name="imageUpload"
          onChangeCapture={(e) => setEditImage(e.target.files[0])}
          accept="image/png, image/jpeg"
        />
      ) : null}

      {/* {publication.imageUrl ? (
          <img src={publication.imageUrl} alt={publication.imageUrl} />
        ) : null} */}

      <Like publication={publication} />
    </div>
  );
};

export default Publication;
