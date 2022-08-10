import { useEffect, useState } from "react";
import { findAll } from "../requests/publicationRequest";
import Publication from "../components/Publication";
import Logo from "../components/Logo";
import Header from "../components/Header";
import PublicationForm from "../components/PublicationForm";
function Home() {
  const [publications, setPublications] = useState(null);
  const [error, setErrors] = useState(null);
  useEffect(() => {
    const getPublications = async () => {
      const response = await findAll();
      if (response.status === 200) {
        // console.log("******* getMessages ");
        setPublications(response.data);
      } else {
        // console.log(response);
        setErrors(response.data);
      }
    };

    getPublications();
  }, []);

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
              // <span key={publication._id}>{publication.content}</span>
              <Publication
                key={publication._id}
                publication={publication}
                index={publications.indexOf(publication)}
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
