import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader } from "../../utils/style/Atom";
import { GetPost, GetPosts } from "../../utils/API";
import { SupprPost } from "../../utils/API";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { userIdApi } from "../../utils/conf";
import "../../utils/style/Publication.css";
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const PageTitle = styled.h1`
  font-size: 30px;
  text-align: center;
  padding-bottom: 30px;
  color: ${({ theme }) => (theme === "light" ? "#000000" : "#ffffff")};
`;
const CardsContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  justify-items: center;
`;
const PublicationContent = styled.span`
  color: ${colors.secondary};
  font-size: 22px;
  font-weight: normal;
  padding-left: 15px;
`;
const PublicationImage = styled.img`
  height: 150px;
  width: 150px;
  align-self: center;
  border-radius: 50%;
`;
const PublicationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 15px;
  background-color: ${colors.backgroundLight};
  border-radius: 30px;
  width: 300px;
  height: 300px;
  transition: 200ms;
  &:hover {
    cursor: pointer;
    box-shadow: 2px 2px 10px #e2e3e9;
  }
`;
const PublicationCreation = styled.span`
  height: 100px;
  color: black;
`;
const FooterPost = styled.div`
  display: flex;
  justify-content: space-around;
  height: 50px;
  margin-top: auto;
`;
const LikeCounter = styled.span`
  color: black;
  height: 50px;
`;
const BtnSupprimer = styled.button`
  text-decoration: none;
`;
const BtnModifier = styled.button`
  text-decoration: none;
`;
/* faThumbsDown = styled(faThumbsDown)`
  color: blue;
`; */
function Publication({
  content,
  imageUrl,
  createdAt,
  id,
  likes,
  dislikes,
  userId,
}) {
  //Like(id, userId);
  const dateCreation = new Date(createdAt).toLocaleDateString("fr");

  return (
    <PublicationWrapper>
      <Link to={`/publication/${id}`} className="itemCard">
        {content ? <PublicationContent>{content}</PublicationContent> : null}
        {imageUrl ? (
          <PublicationImage src={imageUrl} alt="Publication" />
        ) : null}
      </Link>
      <FooterPost>
        <FontAwesomeIcon classname={"faThumbsUp"} icon={faThumbsUp} />
        <LikeCounter>{likes}</LikeCounter>
        <FontAwesomeIcon classname={"faThumbsDown"} icon={faThumbsDown} />
        <LikeCounter>{dislikes}</LikeCounter>

        <PublicationCreation>Créé le {dateCreation}</PublicationCreation>
      </FooterPost>

      {userId === userIdApi ? <BtnModifier>Modifier</BtnModifier> : null}
      {userId === userIdApi ? (
        <BtnSupprimer onClick={() => SupprPost(id)}>Supprimer</BtnSupprimer>
      ) : null}
    </PublicationWrapper>
  );
}
Publication.prototype = {
  id: PropTypes.string,
  userId: PropTypes.string,
  content: PropTypes.string,
  likes: PropTypes.integer,
  dislikes: PropTypes.integer,
  imageUrl: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
};
/* const Like = async (id, userId, likes; dis) => {
  const resp = await CheckLike(id, userId);
  return (
    resp
  );
}; */
const Comment = () => {
  let listPosts;
  const { data, isLoading, error } = GetPosts();
  if (data.length === 0) {
    console.log("pas dispo");
    return <span>Aucun Publication disponible</span>;
  } else {
    listPosts = data;
  }

  if (error) {
    return <span>Oups il y a eu un problème</span>;
  }
  return (
    <div>
      <PageTitle>Voici la liste des posts</PageTitle>
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : (
        <CardsContainer>
          {listPosts.map((post) => (
            <Publication
              key={post._id}
              id={post._id}
              userId={post.userId}
              likes={post.likes}
              dislikes={post.dislikes}
              content={post.content}
              imageUrl={post.imageUrl}
              createdAt={post.createdAt}
            />
          ))}
        </CardsContainer>
      )}
    </div>
  );
};
const CheckLike = async (id, userId) => {
  const result = await GetPost(id);
  if (result.data.usersLiked.includes(userId)) {
    console.log("t'as déjà liké");
    return 1;
  } else if (result.data.usersDisliked.includes(userId)) {
    console.log("ta déjà disliké");
    return -1;
  } else {
    return 0;
  }
};
export default Comment;
