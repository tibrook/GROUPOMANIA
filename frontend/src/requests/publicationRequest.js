import axios from "axios";
import { useUserContext } from "../hooks/useUserContext";
// import { token } from "../utils/conf";
const apiUrl = "https://localhost:3000/api/";


const getConfig = async () => {
  const token = await localStorage.getItem("token");
  return ({
    headers: { Authorization: `Bearer ${token}`, },
  })
}
/* Récuperation des posts  */
const findAll = async () => {
  try {
    return await axios.get(apiUrl + "publication", await getConfig());
  } catch (error) {
    console.log(error);
    return error.response;
  }

};
/* Récuprération d'un post avec l'id du post */
const findOne = async (id) => {
  try {
    return await axios.get(apiUrl + "publication/" + id, await getConfig());
  } catch (error) {
    // console.log(error);
    return error.response;
  }
};
/* Récupération des publications d'un user  */
const findUserPublications = async (userId) => {
  try {
    return await axios.get(apiUrl + "publication/user/" + userId, await getConfig());
  } catch (error) {
    // console.log(error);
    return error.response;
  }
}
/* Ajout like  */
const sendLike = async (like, id) => {
  // console.log(like);
  return axios.post(
    apiUrl + "publication/" + id + "/like",
    { like },
    await getConfig()
  );
};
/* Ajout publication  */
const postPublication = async (image, content) => {
  let formData = new FormData();
  formData.append("image", image);
  formData.append("publi", `{"content" : "${content}"}`);
  // if (content.length > 0) {
  //   publi = { publi: JSON.stringify({ content: content }) };
  // }
  // console.log(...formData);
  return axios.post(apiUrl + "publication/", formData, await getConfig());
};
/* Suppression publication  */
const suppressionPublication = async (id) => {
  return axios.delete(apiUrl + "publication/" + id, await getConfig());
};
/* Modification publication  */
const modifyPublication = async (id, content, image, isDeliting) => {
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

    return axios.put(apiUrl + "publication/" + id, formData, await getConfig());
  } else {
    if (!content) {
      console.log("content vide ");
      return axios.put(apiUrl + "publication/" + id, { content: null }, await getConfig());
    }
    else {
      console.log("on envoie");
      return axios.put(apiUrl + "publication/" + id, { content }, await getConfig());

    }
  }
};
/* Suppression image  */
const deleteImage = async (publication, content) => {
  console.log(content);
  if (content && content.trim().length > 0) {
    return await axios.put(apiUrl + "publication/" + publication._id, { content: content, deleteImage: true }, await getConfig());
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
