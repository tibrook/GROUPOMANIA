import axios from "axios";
// import { token } from "../utils/conf";
const apiUrl = "https://localhost:3000/api/";
const token = localStorage.getItem("token")
let configApi = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const findAll = async () => {
  try {
    return await axios.get(apiUrl + "publication", configApi);
  } catch (error) {
    // console.log(error);
    return error.response;
  }
};
const findOne = async (id) => {
  try {
    return await axios.get(apiUrl + "publication/" + id, configApi);
  } catch (error) {
    // console.log(error);
    return error.response;
  }
};
const sendLike = (like, id) => {
  // console.log(like);
  return axios.post(
    apiUrl + "publication/" + id + "/like",
    { like },
    configApi
  );
};
const postPublication = (image, content) => {
  let formData = new FormData();
  formData.append("image", image);
  formData.append("publi", `{"content" : "${content}"}`);
  // if (content.length > 0) {
  //   publi = { publi: JSON.stringify({ content: content }) };
  // }
  // console.log(...formData);
  return axios.post(apiUrl + "publication/", formData, configApi);
};

const suppressionPublication = (id) => {

  return axios.delete(apiUrl + "publication/" + id, configApi);


};
const modifyPublication = (id, content, image) => {
  if (image) {
    let formData = new FormData();
    formData.append("image", image);
    if (content.trim().length > 0) {
      formData.append("publi", `{"content" : "${content}"}`);
    }
    return axios.put(apiUrl + "publication/" + id, formData, configApi);
  } else {
    return axios.put(apiUrl + "publication/" + id, { content }, configApi);
  }
};
export {
  findAll,
  findOne,
  sendLike,
  postPublication,
  suppressionPublication,
  modifyPublication,
};
