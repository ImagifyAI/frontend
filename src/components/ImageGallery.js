import React, { useEffect, useState } from "react";
import { getImages } from "../api";
import styled from "styled-components";

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding-top: 20px;
`;

const ImageGallery = ({ token }) => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await getImages(token);
                if (response.data.success && Array.isArray(response.data.images)) {
                    setImages(response.data.images);
                } else {
                    setError("Failed to load images");
                }
            } catch (error) {
                console.error("Failed to load images:", error);
                setError("An error occurred while fetching images");
            }
        };

        fetchImages();
    }, [token]);

    const handleDownload = (imageData, filename) => {
        const link = document.createElement("a");
        link.href = imageData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div>
            <h2>Your Gallery</h2>
            <GalleryGrid>
                {images.map((image) => (
                    <div key={image.id} style={{ position: "relative", cursor: "pointer" }}>
                        <img
                            src={image.data}
                            alt="Uploaded"
                            onClick={() => handleDownload(image.data, image.filename)}
                            style={{
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                maxWidth: "100%",
                                transition: "transform 0.2s",
                            }}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(image.data, image.filename);
                            }}
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                background: "#007bff",
                                color: "white",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                opacity: "0.8",
                            }}
                        >
                            Download
                        </button>
                    </div>
                ))}
            </GalleryGrid>
        </div>
    );
};

export default ImageGallery;
