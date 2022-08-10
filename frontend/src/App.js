import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./components/Error";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <BrowserRouter>
        {/* **COMMENT** <GlobalStyle /> retirer si pas nécessaire utiliser juste le index.css  */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
