import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { userIdApi } from "../../utils/conf";
import { findOne } from "../../requests/publicationRequest";
import { sendLike } from "../../requests/publicationRequest";
const Like = ({ publication }) => {
  const [like, setLike] = useState(publication.likes);
  const [dislike, setDislike] = useState(publication.dislikes);
  const [likeActiv, setLikeActive] = useState(false);
  const [disLikeActiv, setDislikeActive] = useState(false);
  useEffect(() => {
    const checkLike = async (id, userId) => {
      const result = await findOne(id);
      if (result.data.usersLiked.includes(userId)) {
        // console.log("t'as déjà liké");
        console.log("userId" + userId + "usersLiked" + result.data.usersLiked);
        setLikeActive(true);
      } else if (result.data.usersDisliked.includes(userId)) {
        // console.log(result.data.usersDisliked);
        // console.log("ta déjà disliké");
        setDislikeActive(true);
      } else {
      }
    };
    checkLike(publication._id, userIdApi);

    // console.log(disLikeActiv);
  });
  const likef = async () => {
    // unlike
    if (likeActiv) {
      const response = await sendLike(0, publication._id);
      //   console.log(response);
      if (response.status === 201) {
        setLikeActive(false);
        setLike(like - 1);
      }
    } else {
      const response = await sendLike(1, publication._id);
      if (response.status === 201) {
        setLikeActive(true);
        setLike(like + 1);
      }
    }
  };
  const disLikef = async () => {
    if (disLikeActiv) {
      const response = await sendLike(0, publication._id);
      if (response.status === 201) {
        setDislikeActive(false);
        setDislike(dislike - 1);
      }
    } else {
      const response = await sendLike(-1, publication._id);
      if (response.status === 201) {
        setDislikeActive(true);
        setDislike(dislike + 1);
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
