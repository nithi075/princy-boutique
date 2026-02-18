import axios from "axios";

const API = axios.create({
  baseURL: "https://princy-boutique-backend.onrender.com",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user?.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return req;
});

export default API;
