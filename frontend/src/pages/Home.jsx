import { useEffect, useState } from "react";
import { findAll } from "../requests/publicationRequest";
import Publication from "../components/Publication";
import Logo from "../components/Logo";
import Header from "../components/Header";
import PublicationForm from "../components/PublicationForm";
import { useNavigate } from "react-router-dom";
import { usePublicationsContext } from "../hooks/usePublicationsContext";
function Home() {
  const { publications, dispatchPublications } = usePublicationsContext();
  const [error, setErrors] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const getPublications = async () => {
      const response = await findAll();
      if (response.status === 200) {
        // console.log(response);
        await dispatchPublications({
          type: "GET_PUBLICATIONS",
          payload: response.data,
        });
      } else {
        console.log(response);
        setErrors(response.data);
      }
    };

    getPublications();
  }, [dispatchPublications, navigate]);

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
