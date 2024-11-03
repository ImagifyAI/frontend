import React, { useState, useEffect } from 'react';
import './ImageUploader.css';

const ImageUploader = () => {
    const [images, setImages] = useState([]);
    const [uploadStatus, setUploadStatus] = useState("");

    const loadUserImages = async () => {
        try {
            const response = await fetch("https://backend.lokesh.cloud/api/images");
            if (response.ok) {
                const data = await response.json();
                setImages(data.images);
            } else if (response.status === 401) {
                window.location.href = "/"; 
            }
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            setUploadStatus("Please select an image first");
            return;
        }
        setUploadStatus("Uploading");

        try {
            const buffer = await file.arrayBuffer();

            const response = await fetch("https://backend.lokesh.cloud/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": file.type
                },
                body: buffer
            });

            if (response.ok) {
                setUploadStatus("Image uploaded successfully");
                loadUserImages();
            } else if (response.status === 401) {
                window.location.href = "/"; 
            } else {
                const errorText = await response.text();
                setUploadStatus(`Image upload failed: ${errorText}`);
            }
        } catch (error) {
            setUploadStatus(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        loadUserImages();
    }, []);

    return (
        <div className="container">
            <div className="upload-section">
                <h2>Upload an Image</h2>
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
        </div>
    );
};

export default ImageUploader;
