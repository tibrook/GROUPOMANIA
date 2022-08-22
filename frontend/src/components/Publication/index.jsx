import Like from "../Like";
import React from "react";
import { useState } from "react";
import {
  suppressionPublication,
  modifyPublication,
  deleteImage,
} from "../../requests/publicationRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTrashCan,
  faSquarePen,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { usePublicationsContext } from "../../hooks/usePublicationsContext";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useUserContext } from "../../hooks/useUserContext";
const Publication = ({ publication, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditConent] = useState(publication.content);
  const [editImage, setEditImage] = useState(null);
  const [isSelectingItem] = useState(false);
  const [error, setError] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = jwt_decode(localStorage.getItem("token"));

  const [errorContent, setErrorContent] = useState("");
  const [isEditingMenu, setEditingMenu] = useState(false);
  const { user } = useUserContext();

  const [isDelitingImage, setIsDelitingImage] = useState(false);
  const { publications, dispatchPublications } = usePublicationsContext();
  let ids = JSON.parse(localStorage.getItem("selectedPost"));
  const [publicationsIds] = useState([]);
  const handleDelete = async () => {
    if (window.confirm("Voulez-vous supprimer la publication ?")) {
      const response = await suppressionPublication(publication._id);
      if (response.status === 204) {
        dispatchPublications({
          type: "DELETE_PUBLICATION",
          payload: publication._id,
        });
      } else {
        setError(true);
      }
    } else {
      return;
    }
  };
  const creationDate = (date) => {
    let response;

    const secondes = Math.floor((Date.now() - new Date(date).valueOf()) / 1000);
    let hours = Math.floor(secondes / 3600);
    let minutes = Math.floor((secondes % 3600) / 60);
    let seconde = Math.floor((secondes % 3600) % 60);
    let jours = Math.floor((hours / 24) % 60);
    let semaines = Math.floor((jours / 7) % 60);
    if (secondes === 0) {
      response = `À l'instant`;
    } else if (secondes <= 59) {
      response = `Posté il y a ${secondes} ${
        secondes > 1 ? "secondes" : "seconde"
      }`;
    } else if (secondes > 59 && secondes < 3600) {
      response = `Posté il y a ${minutes} ${
        minutes > 1 ? "minutes" : "minute"
      } et ${seconde} ${seconde > 1 ? "secondes" : "seconde"}`;
    } else if (secondes > 3599 && secondes < 86400) {
      response = `Posté il y a ${hours} ${
        hours > 1 ? "heures" : "heure"
      } et ${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
    } else if (hours > 23 && hours < 168) {
      response = `Posté il y a ${jours} ${jours > 1 ? "jours" : "jour"}`;
    } else if (hours >= 168) {
      response = `Posté il y a ${semaines} ${
        semaines > 1 ? "semaines" : "semaine"
      }`;
    }

    return response;
  };

  const handleEdit = async () => {
    if (
      editContent.trim().length === 0 &&
      !editImage &&
      !publication.imageUrl
    ) {
      alert("Il faut au moins un message ou une image");
      return;
    }
    console.log(!editImage);
    console.log(editContent.trim().length === 0);
    console.log(editContent);
    console.log(!publication.imageUrl);
    if (
      editContent &&
      !editContent.match(/^[a-zA-Z-éÉè',àç_!?:= ]*$/) &&
      editContent &&
      !editContent.match(
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi
      )
    ) {
      setErrorContent(
        "Les caractères spéciaux ne sont pas acceptés pour le moment.. "
      );
      setError(true);
      return;
    } else {
      setError(false);
    }
    const supprContent =
      editContent && editContent.trim().length === 0 ? false : true;
    // console.log(supprContent);
    // console.log(editContent);
    const response = await modifyPublication(
      publication._id,
      supprContent ? editContent : null,
      editImage ? editImage : null,
      isDelitingImage ? isDelitingImage : false
    );
    console.log(response.data);
    if (response.status === 200) {
      await dispatchPublications({
        type: "UPDATE_PUBLICATION",
        payload: response.data.publi,
      });
      publication = publications.map((publi) =>
        publi._id === publication._id ? publi : null
      )[0];
      setEditImage("");
      setEditingMenu(false);
      setIsEditing(false);
    } else {
      setEditConent("");
      setError(true);
    }
  };
  const handleEditMenu = () => {
    if (!isEditingMenu) {
      setEditingMenu(true);
    } else {
      setEditingMenu(false);
    }
  };
  const btnSupprAll = async () => {
    if (
      window.confirm(
        `Etes vous sur de vouloir supprimer les ${
          ids.length + 1
        } publications ? `
      )
    ) {
      for (let iduser in ids) {
        try {
          // console.log(iduser);
          await suppressionPublication(ids[iduser]);
          localStorage.removeItem("selectedPost");
          dispatchPublications({
            type: "DELETE_PUBLICATION",
            payload: ids[iduser],
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const cancelModif = () => {
    setEditConent(publication.content);
    setEditImage("");
    setIsEditing(false);
  };
  const handleDeleteImage = async () => {
    if (editContent && editContent.trim().length > 0) {
      if (window.confirm("Voulez-vous supprimer l'image ?")) {
        if (
          editContent &&
          !editContent.match(/^[a-zA-Z-éÉè',àç_!?:= ]*$/) &&
          editContent &&
          !editContent.match(
            /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi
          )
        ) {
          setErrorContent(
            "Les caractères spéciaux ne sont pas acceptés pour le moment.. "
          );
          setError(true);
          return;
        } else {
          setError(false);
        }
        const resp = await deleteImage(publication, editContent);

        if (resp.status === 200) {
          setEditImage("");
          setIsDelitingImage(true);
          publication.imageUrl = null;
          publication.content = editContent;
          setIsEditing(false);
          setEditConent(editContent);
        } else {
          console.log("une erreur est survenue lors de la suppression");
        }
      }
    } else {
      alert("Il faut au moins une image ou un message.");
      return;
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
        <Link
          to={{
            pathname: `/user/${publication.userId}`,
            // state: { author: publication.author },
          }}
          state={{ author: publication.author }}
        >
          <span className="authorPubli">{publication.author}</span>
        </Link>
        <span className="dateCreation">
          {creationDate(publication.createdAt)}
        </span>
        <FontAwesomeIcon
          className={
            publication.userId === userId || token.role === "admin"
              ? "faBars"
              : "faHidden"
          }
          icon={faBars}
          onClick={handleEditMenu}
        />
        {isSelectingItem ? (
          <button onClick={btnSupprAll}>
            Supprimer{" "}
            {ids.length === 1 ? "la" : `les ${publicationsIds.length}`}{" "}
            publication
            {ids.length === 1 ? "" : "s"}
          </button>
        ) : null}
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
          {isEditing ? (
            <li className="liSuppr" onClick={cancelModif}>
              Annuler
            </li>
          ) : null}
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
      {editImage || publication.imageUrl ? (
        <img
          src={editImage ? editImage : publication.imageUrl}
          alt={`De : ${user.name} , ${
            editImage ? editImage.name : publication.imageUrl
          }`}
        />
      ) : null}
      <div className="iconWrapper">
        {isEditing &&
        (publication.userId === userId || token.role === "admin") ? (
          <FontAwesomeIcon
            icon={faCheck}
            className="icon_validate"
            onClick={() => handleEdit()}
          />
        ) : !isEditing &&
          (publication.userId === userId || token.role === "admin") ? (
          <FontAwesomeIcon
            icon={faSquarePen}
            onClick={() => setIsEditing(true)}
            className="update_icon"
          />
        ) : null}
        {isEditing &&
        (publication.userId === userId || token.role === "admin") ? (
          <FontAwesomeIcon
            icon={faXmark}
            className="icon_cancel"
            onClick={cancelModif}
          />
        ) : !isEditing &&
          (publication.userId === userId || token.role === "admin") ? (
          <FontAwesomeIcon
            icon={faTrashCan}
            className="delete_icon"
            onClick={() => handleDelete()}
          />
        ) : null}
      </div>

      {isEditing && (editImage || publication.imageUrl) ? (
        <button className="btnSupprImage" onClick={handleDeleteImage}>
          {" "}
          Supprimer l'image
        </button>
      ) : null}

      {isEditing && (editImage || publication.imageUrl) ? (
        <FontAwesomeIcon
          icon={faTrashCan}
          className="delete_image_icon"
          onClick={handleDeleteImage}
        />
      ) : null}
      {isEditing ? (
        <input
          type="file"
          name="imageUpload"
          onChangeCapture={(e) => setEditImage(e.target.files[0])}
          accept="image/png, image/jpeg"
        />
      ) : null}
      <Like publication={publication} />
      {error ? <span className="error">{errorContent}</span> : ""}
    </div>
  );
};

export default Publication;
