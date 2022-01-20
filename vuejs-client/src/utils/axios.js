import axios from "axios";

// Axios function to set base url
const api = axios.create({
  baseURL:
    process.env.VUE_APP_API_URL !== undefined
      ? process.env.VUE_APP_API_URL
      : "http://localhost:5000/",
});

export default api;
