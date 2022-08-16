import { createContext, useReducer } from "react";
export const UserContext = createContext({ user: { auth: false, token: "", userId: "" } });


export const userReducer = (state, action) => {
    // console.log(action.payload);
    switch (action.type) {
        case "LOGIN": return { user: { userId: action.payload.userId, token: action.payload.token, name: action.payload.name, auth: true } }
        case "REGISTER": return { user: { auth: true } }
        case "LOGOUT": return { user: null }
        case "COMPLETE": return state.user
        default: return state
    }
}


export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {
        user: null,
    });
    return (
        <UserContext.Provider value={{ ...state, dispatchUser: dispatch }}>
            {children}
        </UserContext.Provider>
    );
};