import React, { useState, useEffect, useCallback } from 'react';
import './ImageUploader.css';

const ImageUploader = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [images, setImages] = useState([]);
    const [uploadStatus, setUploadStatus] = useState("");

    const checkAuthentication = useCallback(async () => {
        try {
            const response = await fetch("/api/images");
            setIsAuthenticated(response.ok);
            if (response.ok) {
                loadUserImages();
            }
        } catch {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    const loadUserImages = async () => {
        const response = await fetch("/api/images");
        if (response.ok) {
            const data = await response.json();
            setImages(data.images);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setUploadStatus("Please select an image first");
            return;
        }
        setUploadStatus("Uploading...");
    
        try {
            const buffer = await file.arrayBuffer();
    
            const response = await fetch("/api/upload", { 
                method: "POST",
                headers: {
                    "Content-Type": file.type
                },
                body: buffer
            });
    
            if (response.ok) {
                setUploadStatus("Image uploaded successfully");
                loadUserImages();
            } else {
                const errorText = await response.text();
                setUploadStatus(`Image upload failed: ${errorText}`);
            }
        } catch (error) {
            setUploadStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container">
            {!isAuthenticated ? (
                <div className="auth-container">
                    <button className="login-button" onClick={() => (window.location.href = "/")}>
                        Login with Azure Entra ID
                    </button>
                </div>
            ) : (
                <>
                    <div className="upload-section">
                        <h2>Upload an Image</h2>
                        {/* File input styled as a button */}
                        <label className="file-input-label">
                            Select an Image
                            <input
                                type="file"
                                onChange={handleUpload}
                                accept="image/*"
                                className="file-input"
                            />
                        </label>
                        <p className="upload-status">{uploadStatus}</p>
                    </div>
                    <div className="gallery-section">
                        <h2>Your Uploaded Images</h2>
                        <div className="image-gallery">
                            {images.length > 0 ? (
                                images.map((image) => (
                                    <div className="image-card" key={image.id}>
                                        <img
                                            src={`/api/image/${image.filename}`}
                                            alt={`Uploaded on ${image.upload_date}`}
                                            className="gallery-image"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No images uploaded yet</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageUploader;
