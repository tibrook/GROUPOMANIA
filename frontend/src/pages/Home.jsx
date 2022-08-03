import Message from "../components/Comment";
import { useEffect, useState } from "react";
import { findAll } from "../requests/publicationRequest";
import MessageCard from "../components/MessageCard";
const Home = () => {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchPublis = async () => {
      const reponse = await findAll();
      return reponse.data;

      /*  if ((reponse.status = 200)) {
        console.log(reponse.data, messages);
      } */
    };
    const data = fetchPublis();
    console.log(data);
    //setMessages(data);
  }, []);

  return (
    <div>
      <h1>Voici les derniers posts en cours 👩‍💻👨‍💻👩‍💻</h1>
      {messages &&
        messages.map((message) => (
          <MessageCard key={message._id} message={message} />
        ))}
      {/*   <Message /> */}
    </div>
  );
};

export default Home;
