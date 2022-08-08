import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { userIdApi } from "../../utils/conf";
import { findOne } from "../../requests/publicationRequest";
import Like from "../Like";
// userIdApi  a modifier quand le login sera développé

const Publication = ({ publication }) => {
  // checkLike(publication._id, userIdApi);
  return (
    <div
      className={
        publication.userId === userIdApi
          ? "cardWrapper"
          : "cardWrapper cardWrapperModif"
      }
    >
      {publication.content ? <span>{publication.content}</span> : null}
      {publication.imageUrl ? (
        <img src={publication.imageUrl} alt={publication.imageUrl} />
      ) : null}
      <div className="btnWrapper">
        <button>Modifier</button>
        <button>Supprimer</button>
      </div>
      <Like publication={publication} />
    </div>
  );
};
const checkLike = async (id, userId) => {
  const result = await findOne(id);
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
export default Publication;
