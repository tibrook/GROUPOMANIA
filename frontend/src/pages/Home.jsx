import { useEffect, useState } from "react";
import { findAll } from "../requests/publicationRequest";
import Publication from "../components/Publication";
import Logo from "../components/Logo";
import Header from "../components/Header";
import PublicationForm from "../components/PublicationForm";
import { useNavigate } from "react-router-dom";
import { usePublicationsContext } from "../hooks/usePublicationsContext";
import { useUserContext } from "../hooks/useUserContext";
// import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import { suppressionPublication } from "../requests/publicationRequest";
function Home() {
  // const [publications, setPublications] = useState(null);
  const { publications, dispatchPublications } = usePublicationsContext();
  const [error, setErrors] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  let history = useNavigate();
  const ids = JSON.parse(localStorage.getItem("selectedPost"));

  // console.log(publications);
  useEffect(() => {
    const getPublications = async () => {
      console.log("copucou");
      const response = await findAll();
      if (response.status === 200) {
        dispatchPublications({
          type: "GET_PUBLICATIONS",
          payload: response.data,
        });
        // console.log("******* getMessages ");
        // setPublications(response.data);
      } else {
        // console.log(response);
        setErrors(response.data);
      }
    };
    if (!localStorage.getItem("token")) {
      history("/login");
    } else {
      getPublications();
    }
  }, [dispatchPublications]);

  return (
    <div className="mainWrapper">
      <header>
        <Logo />

        <Header />
      </header>
      <section>
        <PublicationForm />
        <div className="publicationWrapper">
          <h1>Publications récentes 👩‍💻👨‍💻 </h1>
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
}

export default Home;
