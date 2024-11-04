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

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await getImages(token);
                setImages(response.data.images);
            } catch (error) {
                console.error("Failed to load images:", error);
            }
        };
        fetchImages();
    }, [token]);

    return (
        <div>
            <h2>Your Gallery</h2>
            <GalleryGrid>
                {images.map((image) => (
                    <img
                        key={image.id}
                        src={`https://your-r2-bucket-url/${image.filename}`}
                        alt="Uploaded"
                        style={{ borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
                    />
                ))}
            </GalleryGrid>
        </div>
    );
};

export default ImageGallery;
