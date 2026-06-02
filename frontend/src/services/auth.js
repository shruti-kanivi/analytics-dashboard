import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});


// SIGNUP
export const signup = async (data) => {
  return API.post("/signup", data);
};


// LOGIN
export const login = async (data) => {
  return API.post("/login", data);
};