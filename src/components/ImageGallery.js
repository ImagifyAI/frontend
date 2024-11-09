import React, { useEffect, useState, useCallback } from "react";
import { getImages, searchImages } from "../api"; 
import styled from "styled-components";

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding-top: 20px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const FullImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const DownloadButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.9;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
`;

const ImageGallery = ({ token }) => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [query, setQuery] = useState(""); 

    const fetchImages = useCallback(async () => {
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
    }, [token]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleImageClick = (image) => {
        setSelectedImage(image); 
    };

    const handleDownload = (imageData, filename) => {
        const link = document.createElement("a");
        link.href = imageData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleSearch = async () => {
        try {
            const response = await searchImages(token, query); 
            if (response.data.success) {
                setImages(response.data.images);
            } else {
                setError("No results found for this tag.");
            }
        } catch (error) {
            console.error("Search failed:", error);
            setError("An error occurred while searching images.");
        }
    };

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div>
            <h2>Your Gallery</h2>
            <input
                type="text"
                placeholder="Search by tag"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <GalleryGrid>
                {images.map((image) => (
                    <img
                        key={image.id}
                        src={image.data}
                        alt="Uploaded"
                        onClick={() => handleImageClick(image)}
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            maxWidth: "100%",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                        }}
                    />
                ))}
            </GalleryGrid>

            {selectedImage && (
                <Modal onClick={closeModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <FullImage src={selectedImage.data} alt="Expanded" />
                        <DownloadButton onClick={() => handleDownload(selectedImage.data, selectedImage.filename)}>
                            Download
                        </DownloadButton>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};

export default ImageGallery;
