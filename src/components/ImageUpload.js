import React, { useState } from "react";
import { uploadImage } from "../api";

const ImageUpload = ({ token }) => {
    const [file, setFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        setStatusMessage(""); 

        if (!file) {
            setStatusMessage("Please select a file to upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await uploadImage(token, formData.get("image"));

            if (response.data.success) {
                setStatusMessage("Image uploaded successfully!");
            } else {
                setStatusMessage("Image upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setStatusMessage("An error occurred during upload. Please try again.");
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
        </div>
    );
};

export default ImageUpload;
