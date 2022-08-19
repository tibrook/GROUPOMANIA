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
const findUserPublications = async (userId) => {
  try {
    return await axios.get(apiUrl + "publication/user/" + userId, configApi);
  } catch (error) {
    // console.log(error);
    return error.response;
  }
}
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
const modifyPublication = (id, content, image, isDeliting) => {
  console.log(content);
  console.log(image);
  // console.log(id);
  if (image) {
    let formData = new FormData();
    formData.append("image", image);
    if (content && content.trim().length > 0) {
      console.log("c'est bien");
      console.log({ content });
      formData.append("publi", `{"content" : "${content}"}`);
    } else if (!content) {
      // formData.append("publi", `{"content" : null}`);
      console.log("c'est null");
    }
    console.log("on sort ");

    return axios.put(apiUrl + "publication/" + id, formData, configApi);
  } else {
    if (!content) {
      console.log("content vide ");
      return axios.put(apiUrl + "publication/" + id, { content: null }, configApi);
    }
    else {
      console.log("on envoie");
      return axios.put(apiUrl + "publication/" + id, { content }, configApi);

    }
  }
};
const deleteImage = async (publication, content) => {
  console.log(content);
  if (content && content.trim().length > 0) {

    return await axios.put(apiUrl + "publication/" + publication._id, { content: content, deleteImage: true }, configApi);

  }
}


export {
  findAll,
  findOne,
  sendLike,
  postPublication,
  suppressionPublication,
  modifyPublication,
  findUserPublications,
  deleteImage
};
