import React, { useState } from "react";
import { uploadImage } from "../api";

const ImageUpload = ({ token, onUpload }) => {
    const [file, setFile] = useState(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append("image", file);
            await uploadImage(token, formData.get("image"));
            onUpload();
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <h2>Upload Your Image</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default ImageUpload;
