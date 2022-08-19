import { createContext, useReducer } from "react";
export const PublicationContext = createContext();

export const publicationReducer = (state, action) => {

    // console.log(`State : ${state.publications} Action : ${action.type}`);
    switch (action.type) {
        case "GET_PUBLICATIONS":
            return { publications: action.payload };
        case "CREATE_PUBLICATION":
            return { publications: [action.payload, ...state.publications] };
        case "DELETE_PUBLICATION":
            return {
                publications: [
                    ...state.publications.filter((publication) =>
                        publication._id !== action.payload)
                ]
            };
        case "UPDATE_PUBLICATION":
            console.log(action.payload);
            return {
                publications: [
                    ...state.publications.map((publication) => publication._id === action.payload._id ? action.payload : publication)
                ]
            };

        default:
            return state;
    }

};

export const PublicationContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(publicationReducer, {
        publications: null,
    });
    return (
        <PublicationContext.Provider value={{ ...state, dispatchPublications: dispatch }}>
            {children}
        </PublicationContext.Provider>
    );
};
