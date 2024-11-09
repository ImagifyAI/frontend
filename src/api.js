import axios from "axios";

const API_URL = "https://backend.lokesh.cloud/api";

export const register = (email, password) => 
    axios.post(`${API_URL}/register`, { email, password });

export const login = (email, password) => 
    axios.post(`${API_URL}/login`, { email, password });

export const uploadImage = (token, image) => {
    const formData = new FormData();
    formData.append("image", image);

    return axios.post(`${API_URL}/upload`, formData, {
        headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
        },
        withCredentials: true 
    });
};

export const getImages = (token) => 
    axios.get(`${API_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const searchImages = (token, query) => {
    return axios.post(
        `${API_URL}/search`, 
        { query },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};
