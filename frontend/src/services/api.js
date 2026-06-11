import axios
from "axios";

const API =
axios.create({
  baseURL:
"https://mindvault-ai-backend.onrender.com/api",
});
API.interceptors.request.use(
  (config) => {

    const token =
    localStorage.getItem(
      "token"
    );

    console.log(
      "TOKEN IN API:",
      token
    );

    if (token) {

      config.headers.Authorization =
      `Bearer ${token}`;
    }

    return config;
  }
);


export default API;