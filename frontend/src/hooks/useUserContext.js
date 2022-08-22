import { UserContext } from "../context/UserContext";
import { useContext } from "react";

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw Error("Il y a une erreur de contexte");
    }
    return context;
}