import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
  color: white;
  padding: 40px;

  h1 {
    font-size: 48px;
    margin-bottom: 20px;
  }

  p {
    font-size: 20px;
    max-width: 600px;
    margin: 10px auto 20px;
  }

  button {
    margin-top: 20px;
    padding: 15px 30px;
    font-size: 18px;
    font-weight: bold;
    background-color: #ff7f50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #ff5722;
  }
`;

const HomePage = ({ token }) => {
    const navigate = useNavigate();

    const handleUploadClick = () => {
        if (token) {
            navigate("/upload");
        } else {
            navigate("/login");
        }
    };

    return (
        <HomeContainer>
            <h1>Welcome to ImagifyAI</h1>
            <p>
                ImagifyAI allows you to easily upload and manage your images in a seamless and secure environment. 
                Log in to access your gallery or register to start creating your personal image collection.
            </p>
            <button onClick={handleUploadClick}>Upload Your Image</button>
        </HomeContainer>
    );
};

export default HomePage;
