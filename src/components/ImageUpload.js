import React, { useState } from "react";
import { uploadImage } from "../api";

const ImageUpload = ({ token }) => {
    const [file, setFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [tags, setTags] = useState([]);

    const handleUpload = async (e) => {
        e.preventDefault();
        setStatusMessage("");
        setTags([]); 
    
        if (!file) {
            setStatusMessage("Please select a file to upload");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("image", file);
    
            const decodedToken = JSON.parse(atob(token.split('.')[1])); 
            console.log("Decoded Token:", decodedToken);  
            
            const userId = decodedToken.sub;  
    
            if (!userId) {
                setStatusMessage("User ID missing or invalid in token");
                return;
            }
    
            formData.append("userId", userId);  
    
            console.log("Decoded userId:", userId);
    
            const response = await uploadImage(token, formData);
    
            if (response.data.success) {
                setStatusMessage("Image uploaded successfully");
                setTags(response.data.tags);  
            } else {
                setStatusMessage("Image upload failed");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setStatusMessage("An error occurred during upload");
        }
    };
    

    return (
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <h2>Upload Your Image</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Upload</button>
            </form>
            {statusMessage && <p style={{ color: statusMessage.includes("success") ? "green" : "red" }}>{statusMessage}</p>}
            {tags.length > 0 && (
                <div>
                    <h3>Generated Tags:</h3>
                    <p>{tags.join(", ")}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
