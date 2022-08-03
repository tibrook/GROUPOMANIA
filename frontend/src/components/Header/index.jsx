import { Link } from "react-router-dom";

function Header() {
  return (
    <nav>
      <Link to="/">Accueil</Link>
      <Link to="/createPost">Créer un Post</Link>
    </nav>
  );
}

export default Header;
