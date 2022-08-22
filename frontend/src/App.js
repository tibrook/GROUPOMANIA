import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./components/Error";
import Login from "./pages/Login";
import User from "./pages/User";
import { useUserContext } from "./hooks/useUserContext";

function App() {
  const { user } = useUserContext();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user && user.auth ? <Navigate replace to="/" /> : <Login />} />
          <Route path="/" element={user && user.auth ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/user/:userId" element={user && user.auth ? <User /> : <Navigate replace to="/login" />} />
          <Route path="*" element={user && user.auth ? <Error /> : <Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
