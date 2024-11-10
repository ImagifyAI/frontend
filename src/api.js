import axios from "axios";

const API_URL = "https://backend.lokesh.cloud/api";

export const register = (email, password, turnstileToken) => 
    axios.post(`${API_URL}/register`, { email, password, turnstileToken });

export const login = (email, password, turnstileToken) => 
    axios.post(`${API_URL}/login`, { email, password, turnstileToken });

export const uploadImage = async (formData, token) => {
    try {
        const response = await axios.post(
            "https://backend.lokesh.cloud/api/upload", 
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response;
    } catch (error) {
        console.error("API Request failed:", error);
        throw error;
    }
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
