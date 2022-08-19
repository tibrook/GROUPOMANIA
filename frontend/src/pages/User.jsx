import { useEffect, useState } from "react";
import { findUserPublications } from "../requests/publicationRequest";
import Publication from "../components/Publication";
import Logo from "../components/Logo";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { usePublicationsContext } from "../hooks/usePublicationsContext";
import { useParams } from "react-router-dom";
const User = () => {
  const { publications, dispatchPublications } = usePublicationsContext();
  const location = useLocation();
  //   console.log(location);
  const author = location.state?.author;
  //   console.log(author);
  const [error, setErrors] = useState(null);
  const userIdLocalStorage = localStorage.getItem("userId");
  let { userId } = useParams();
  let history = useNavigate();
  useEffect(() => {
    const getPublications = async () => {
      const response = await findUserPublications(userId);
      if (response.status === 200) {
        dispatchPublications({
          type: "GET_PUBLICATIONS",
          payload: response.data,
        });
      } else {
        setErrors(response.data);
        // console.log(response);
      }
    };
    if (!localStorage.getItem("token")) {
      history("/login");
    } else {
      getPublications();
    }
  }, [dispatchPublications, history, userId]);

  return (
    <div className="mainWrapper">
      <header>
        <Logo />

        <Header />
      </header>
      <section>
        <div className="publicationWrapper">
          {userId === userIdLocalStorage ? (
            <h1>Mes publications</h1>
          ) : (
            <h1>Publications de {author}</h1>
          )}
          {publications ? (
            publications.map((publication) => (
              <Publication
                key={publication._id}
                publication={publication}
                index={publications.indexOf(publication)}
                isChecked={false}
              />
            ))
          ) : (
            <span className="errorSpan">{error}</span>
          )}
        </div>
      </section>
    </div>
  );
};
export default User;
