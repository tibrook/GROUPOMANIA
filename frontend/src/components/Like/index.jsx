import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { findOne } from "../../requests/publicationRequest";
import { sendLike } from "../../requests/publicationRequest";
import { usePublicationsContext } from "../../hooks/usePublicationsContext";
const Like = ({ publication }) => {
  const { dispatchPublications } = usePublicationsContext();
  const [like, setLike] = useState(publication.likes);
  const [dislike, setDislike] = useState(publication.dislikes);
  const [likeActiv, setLikeActive] = useState(false);
  const [disLikeActiv, setDislikeActive] = useState(false);
  const userIdApi = localStorage.getItem("userId");
  useEffect(() => {
    const checkLike = async (id, userId) => {
      const result = await findOne(id);
      if (result.data.usersLiked.includes(userId)) {
        setLikeActive(true);
      } else if (result.data.usersDisliked.includes(userId)) {
        setDislikeActive(true);
      } else {
      }
    };
    checkLike(publication._id, userIdApi);
  });
  const likef = async () => {
    if (likeActiv) {
      const response = await sendLike(0, publication._id);
      if (response.status === 201) {
        setLikeActive(false);
        await setLike(like - 1);
        await dispatchPublications({
          type: "UPDATE_PUBLICATION",
          payload: {
            ...publication,
            likes: like - 1,
          },
        });
      }
    } else {
      const response = await sendLike(1, publication._id);

      if (response.status === 201) {
        setLikeActive(true);
        setLike(like + 1);

        await dispatchPublications({
          type: "UPDATE_PUBLICATION",
          payload: {
            ...publication,
            likes: like + 1,
          },
        });
      }
    }
  };
  const disLikef = async () => {
    if (disLikeActiv) {
      const response = await sendLike(0, publication._id);
      if (response.status === 201) {
        setDislikeActive(false);
        setDislike(dislike - 1);
        dispatchPublications({
          type: "UPDATE_PUBLICATION",
          payload: {
            ...publication,
            dislikes: dislike - 1,
          },
        });
      }
    } else {
      const response = await sendLike(-1, publication._id);
      if (response.status === 201) {
        setDislikeActive(true);
        setDislike(dislike + 1);

        await dispatchPublications({
          type: "UPDATE_PUBLICATION",
          payload: {
            ...publication,
            dislikes: dislike + 1,
          },
        });
      }
    }
  };

  return (
    <div className="footerPost">
      <FontAwesomeIcon
        className={[
          likeActiv ? "faThumbsUpGreen" : disLikeActiv ? "disabled" : "null",
        ].join("")}
        onClick={likef}
        icon={faThumbsUp}
      />
      <span>{like}</span>

      <FontAwesomeIcon
        className={[
          disLikeActiv ? "faThumbsDownRed" : likeActiv ? "disabled" : "null",
        ].join("")}
        onClick={disLikef}
        icon={faThumbsDown}
      />
      <span>{dislike}</span>
    </div>
  );
};
export default Like;
