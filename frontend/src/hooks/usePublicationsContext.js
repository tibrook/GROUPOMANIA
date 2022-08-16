import { PublicationContext } from "../context/PublicationsContext";
import { useContext } from "react";

export const usePublicationsContext = () => {
    const context = useContext(PublicationContext);
    if (!context) {
        throw Error("Il y a une erreur de contexte");
    }
    return context;
}