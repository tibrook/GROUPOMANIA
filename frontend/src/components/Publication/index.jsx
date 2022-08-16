import Like from "../Like";
import React from "react";
import { useState } from "react";
import {
  suppressionPublication,
  modifyPublication,
} from "../../requests/publicationRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { usePublicationsContext } from "../../hooks/usePublicationsContext";

const Publication = ({ publication, index, selectAll }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditConent] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isSelectingItem, setIsSelectingItem] = useState(false);
  const [error, setError] = useState(false);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [errorContent, setErrorContent] = useState("");
  const [isEditingMenu, setEditingMenu] = useState(false);
  const { publications, dispatchPublications } = usePublicationsContext();
  let ids = JSON.parse(localStorage.getItem("selectedPost"));
  const [publicationsIds, setPublicationsIds] = useState([]);
  const handleDelete = async () => {
    const response = await suppressionPublication(publication._id);
    if (response.status === 204) {
      dispatchPublications({
        type: "DELETE_PUBLICATION",
        payload: publication._id,
      });
    } else {
      setError(true);
    }
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

  const handleEdit = async () => {
    if (
      editContent.trim().length === 0 &&
      publication.content.trim().length === 0 &&
      !editImage &&
      !publication.imageUrl
    ) {
      alert("Il faut au moins un message ou une image");
      return;
    }
    if (
      !editContent.match(/^[a-zA-Z-éÉè',àç_!?:= ]*$/) &&
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
    const response = await modifyPublication(
      publication._id,
      editContent,
      editImage
    );
    if (response.status === 200) {
      dispatchPublications({
        type: "UPDATE_PUBLICATION",
        payload: {
          ...publication,
          content: editContent,
          imageUrl: editImage,
        },
      });
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
          console.log(iduser);
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
  const selectPost = async (id, checked) => {
    console.table(publicationsIds);

    // ids = JSON.parse(localStorage.getItem("selectedPost"));
    // // console.log(ids);
    // let selectedPosts;
    // // console.log(selectedPosts);
    // if (!localStorage.getItem("selectedPost")) {
    //   selectedPosts = [];
    // } else {
    //   selectedPosts = JSON.parse(localStorage.getItem("selectedPost")) || [
    //     localStorage.getItem("selectedPost"),
    //   ];
    // }
    if (checked) {
      setIsSelectingItem(true);
      // console.log(selectedPosts);
      // selectedPosts.push(id);
      console.log(`PublicationsIds avant changement ${publicationsIds}`);
      console.log(id);
      // setPublicationsIds(id);
      // setPublicationsIds((prev) => [...prev, id]);
      if (publicationsIds.length === 0) {
        console.log("length a 0");
        setPublicationsIds([...publicationsIds, id]);
        console.table(publicationsIds);
      } else {
        setPublicationsIds([...publicationsIds, id]);
      }
      // localStorage.setItem("selectedPost", JSON.stringify(selectedPosts));
      console.table(publicationsIds);

      // console.log(selectedPosts);
    } else {
      setIsSelectingItem(false);
      console.log(`PublicationsIds avant changement ${publicationsIds}`);

      setPublicationsIds(
        publicationsIds.filter((publication) => publication !== id)
      );
      console.log(`PublicationsIds après changement ${publicationsIds}`);

      // if (selectedPosts.filter((e) => e !== id).length === 0) {
      //   localStorage.removeItem("selectedPost");
      // } else {
      //   localStorage.setItem(
      //     "selectedPost",
      //     JSON.stringify(selectedPosts.filter((e) => e !== id))
      //   );
      // }
      // console.log(selectedPosts);
    }
  };
  // console.log(selectAll);
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
          className={
            publication.userId === userId || role === "admin"
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

        {publication.userId === userId || role === "admin" ? (
          <input
            type="checkbox"
            onChange={(e) => {
              console.log(e.target.checked);
              selectPost(publication._id, e.target.checked);
            }}
          ></input>
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
      <Like publication={publication} />
      {error ? <span className="error">{errorContent}</span> : ""}
    </div>
  );
};

export default Publication;
