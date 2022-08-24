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
import Swal from 'sweetalert2'
const Publication = ({ publication, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditConent] = useState(publication.content);
  const [editImage, setEditImage] = useState(null);
  const [error, setError] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = jwt_decode(localStorage.getItem("token"));
  const [errorContent, setErrorContent] = useState("");
  const [isEditingMenu, setEditingMenu] = useState(false);
  const { user } = useUserContext();
  const [isDelitingImage, setIsDelitingImage] = useState(false);
  const { publications, dispatchPublications } = usePublicationsContext();

  /* Suppression de publication  */
  const handleDelete = async () => {
    await Swal.fire({
      title: 'Êtes-vous sûrs de vouloir supprimer la publication?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await suppressionPublication(publication._id);
        if (response.status === 204) {
          dispatchPublications({
            type: "DELETE_PUBLICATION",
            payload: publication._id,
          });
          Swal.fire(
            'Supprimé !',
            'Votre publication a été supprimée.',
            'success'
          )
        } else {
          setError(true);
        }
      } else {
        return;

      }
    })

  };
  /* Génération du message de date de création */
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
      response = `Posté il y a ${secondes} ${secondes > 1 ? "secondes" : "seconde"
        }`;
    } else if (secondes > 59 && secondes < 3600) {
      response = `Posté il y a ${minutes} ${minutes > 1 ? "minutes" : "minute"
        } et ${seconde} ${seconde > 1 ? "secondes" : "seconde"}`;
    } else if (secondes > 3599 && secondes < 86400) {
      response = `Posté il y a ${hours} ${hours > 1 ? "heures" : "heure"
        } et ${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
    } else if (hours > 23 && hours < 168) {
      response = `Posté il y a ${jours} ${jours > 1 ? "jours" : "jour"}`;
    } else if (hours >= 168) {
      response = `Posté il y a ${semaines} ${semaines > 1 ? "semaines" : "semaine"
        }`;
    }

    return response;
  };
  /* Clic sur icone de modification */
  const handleEditMenu = () => {
    if (!isEditingMenu) {
      setEditingMenu(true);
    } else {
      setEditingMenu(false);
    }
  };

  /* Validation de la modification  */
  const handleEdit = async () => {
    if (
      (editContent.trim().length === 0) &&
      !editImage &&
      !publication.imageUrl
    ) {
      console.log("marché");
      Swal.fire(
        'Erreur  !',
        'Il faut au moins une image ou un message.',
        'error'
      )
      return;
    }
    // console.log(editImage.length);
    // console.log(publication.imageUrl.length);

    if (
      editContent &&
      !editContent.match(/^[a-zA-Z0-9-éÉè.',àç_!?:= ]*$/) &&
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
    const response = await modifyPublication(
      publication._id,
      supprContent ? editContent : null,
      editImage ? editImage : null,
      isDelitingImage ? isDelitingImage : false
    );
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
      Swal.fire(
        'Erreur  !',
        response.data.error,
        'error'
      )
      setEditConent("");
      setError(true);
    }
  };
  /* Annulation */
  const cancelModif = () => {
    setEditConent(publication.content);
    setEditImage("");
    setIsEditing(false);
  };
  /* Suppression d'image */
  const handleDeleteImage = async () => {
    if (editContent && editContent.trim().length > 0) {
      Swal.fire({
        title: "Supprimer l'image?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: "Annuler"

      }).then(async (result) => {
        if (result.isConfirmed) {
          if (publication.imageUrl) {
            if (
              editContent &&
              !editContent.match(/^[a-zA-Z0-9-éÉ.è',àç_!?:= ]*$/) &&
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
              Swal.fire(
                'Supprimée!',
                'Votre image a bien été supprimée.',
                'success'
              )
            } else {
              Swal.fire(
                'Erreur  !',
                'Une erreur est survenue lors de la suppression.',
                'error'
              )
            }

          }
          else {
            setEditImage(null);
          }
        } else {
          return;
        }

      })
    }
    else {
      Swal.fire(
        'Erreur  !',
        'Il faut au moins une image ou un message.',
        'error'
      )
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
          }}
          state={{ author: publication.author }}
        >
          <span
            className={
              isEditing ? "authorPubli authorPubliModif" : "authorPubli"
            }
          >
            {publication.author}
          </span>
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
        <label htmlFor="updateArea" className="udpateArea">
          Publier votre message
        </label>
      ) : null}
      {isEditing ? (
        <textarea
          id="updateArea"
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
          alt={`De : ${user.name} , ${editImage ? editImage.name : publication.imageUrl
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
          id="uploadModified"
          type="file"
          name="imageUpload"
          onChangeCapture={(e) => setEditImage(e.target.files[0])}
          accept="image/png, image/jpeg"
        />
      ) : null}
      {isEditing ? (
        <label htmlFor="uploadModified"> Sélectionner une image</label>
      ) : null}
      <Like publication={publication} />
      {error ? <span className="error">{errorContent}</span> : ""}
    </div>
  );
};

export default Publication;
