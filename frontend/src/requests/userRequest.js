import axios from "axios";

const apiUrl = "https://localhost:3000/api/";


const signup = async (email, password, firstname, lastname) => {

    try {
        return await axios.post(apiUrl + "auth/signup", { email, password, firstname, lastname })
    }

    catch (error) {
        return error.response.data.error.message;
    }
}
const login = async (email, password) => {
    try {
        return await axios.post(apiUrl + "auth/login", { email, password })
    }

    catch (error) {
        console.log(error);
        return error.response;
    }
}
export {
    signup, login
}