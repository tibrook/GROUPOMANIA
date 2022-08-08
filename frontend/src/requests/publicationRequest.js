import axios from "axios";

const apiUrl = "https://localhost:3000/api/";
const configApi = {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmUyNGJlYTBlNmJlN2Q3ZGI5NzhiNjYiLCJpYXQiOjE2NTk5NDA0MDksImV4cCI6MTY2MDAyNjgwOX0.3jDvP64rfg5DxbHkD9PMrHXxUqW37Y3ytHYJLs6X6zk`,
  },
};
const findAll = async () => {
  try {
    return await axios.get(apiUrl + "publication", configApi);
  } catch (error) {
    console.log(error);
    return error.response;
  }
};
const findOne = async (id) => {
  try {
    return await axios.get(apiUrl + "publication/" + id, configApi);
  } catch (error) {
    console.log(error);
    return error.response;
  }
};
const sendLike = (like, id) => {
  console.log(like);
  return axios.post(
    apiUrl + "publication/" + id + "/like",
    { like },
    configApi
  );
};
export { findAll, findOne, sendLike };
