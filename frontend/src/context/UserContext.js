import { createContext, useReducer } from "react";
const userId = localStorage.getItem("userId")
const token = localStorage.getItem("token")
const name = localStorage.getItem("name")
const auth = localStorage.getItem("auth")
const user = userId ? { userId: userId, token: token, name: name, auth: auth } : null
export const UserContext = createContext();


export const userReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("userId", action.payload.userId);
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("name", action.payload.name);
            localStorage.setItem("auth", true);
            return { user: { userId: action.payload.userId, token: action.payload.token, name: action.payload.name, auth: true } }
        case "REGISTER":
            localStorage.setItem("auth", false);
            return { user: { auth: false } }
        case "LOGOUT":
            localStorage.removeItem("name");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.setItem("auth", false);

            return { user: null }
        default: return state
    }
}


export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {
        user: user
    })
    return (
        <UserContext.Provider value={{ ...state, dispatchUser: dispatch }}>
            {children}
        </UserContext.Provider>
    );
};