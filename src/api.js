import axios from "axios";

const API_URL = "https://backend.lokesh.cloud/api";

export const register = (email, password, headers = {}) => 
    axios.post(
        `${API_URL}/register`,
        { email, password },
        { headers } 
    );

export const login = (email, password, headers = {}) => 
    axios.post(
        `${API_URL}/login`, 
        { email, password }, 
        { headers } 
    );


export const uploadImage = async (formData) => {
    const token = localStorage.getItem("authToken"); 
    try {
        const response = await axios.post(
            `${API_URL}/upload`, 
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

export const getImages = () => {
    const token = localStorage.getItem("authToken");
    return axios.get(`${API_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const searchImages = (query) => {
    const token = localStorage.getItem("authToken"); 
    return axios.post(
        `${API_URL}/search`, 
        { query },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};
