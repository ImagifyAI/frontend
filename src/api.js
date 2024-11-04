import axios from "axios";

const API_URL = "https://backend.lokesh.cloud/api";

export const register = (email, password) => axios.post(`${API_URL}/register`, { email, password });
export const login = (email, password) => axios.post(`${API_URL}/login`, { email, password });
export const uploadImage = (token, image) =>
    axios.post(`${API_URL}/upload`, image, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": image.type },
    });
export const getImages = (token) =>
    axios.get(`${API_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` },
    });
