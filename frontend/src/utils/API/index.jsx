import { useState, useEffect } from "react";
import axios from "axios";
//require("dotenv").config();
import { configApi, urlApi } from "../conf";
export function GetPosts() {
  const [data, setPost] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await axios.get(urlApi + "publication", configApi);
        const data = await response;
        setPost(data.data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  // console.log(data);
  return { isLoading, data, error };
}
export const GetPost = (id) => {
  const [data, setPost] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await axios.get(
          urlApi + "publication/" + id,
          configApi
        );
        const data = await response;
        // console.log(data.data);
        setPost(data.data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  // console.log(data);
  return { isLoading, data, error };
};
export const GetName = (userId) => {};
export const SupprPost = async (id) => {
  //console.log(id);
  if (window.confirm("Voulez-vous vraiment supprimer ? ")) {
    try {
      const response = await axios.delete(
        urlApi + "publication/" + id,
        configApi
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
};
