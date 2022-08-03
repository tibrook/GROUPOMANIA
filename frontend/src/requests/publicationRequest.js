import axios from "axios";

const apiUrl = "https://localhost:3000/api/";
const configApi = {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmUyNGJlYTBlNmJlN2Q3ZGI5NzhiNjYiLCJpYXQiOjE2NTk1MzIxMzIsImV4cCI6MTY1OTYxODUzMn0.fUwRYYK1uxaYxF5x3m4RzoZv12A498JUZwyVaiqU6Rw`,
  },
};
const findAll = async () => {
  try {
    return await axios.get(apiUrl + "publication", configApi);
  } catch (error) {
    return error.response;
  }
};
export { findAll };
