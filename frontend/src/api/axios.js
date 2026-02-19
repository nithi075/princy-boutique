import axios from "axios";

const API = axios.create({
baseURL: "https://princy-boutique-backend.onrender.com/api",
withCredentials: true,
});

/* Attach JWT token automatically to every request */
API.interceptors.request.use((req) => {

const token = localStorage.getItem("token");

if (token) {
req.headers.Authorization = `Bearer ${token}`;
}

return req;
});

export default API;
