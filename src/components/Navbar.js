import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  background: #1c1c1e;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: #f9f9f9;
    cursor: pointer;
  }

  a, button {
    color: white;
    background: none;
    border: none;
    text-decoration: none;
    margin-left: 20px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  a:hover, button:hover {
    color: #007bff;
  }
`;

const Navbar = ({ token }) => {
    const navigate = useNavigate();

    const handleGalleryClick = () => {
        if (token) {
            navigate("/gallery");
        } else {
            navigate("/login");
        }
    };

    return (
        <Nav>
            <h1 onClick={() => navigate("/")}>ImagifyAI</h1>
            <div>
                <button onClick={handleGalleryClick}>Gallery</button>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </Nav>
    );
};

export default Navbar;
