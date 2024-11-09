import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AuthForm from "./components/AuthForm";
import ImageUpload from "./components/ImageUpload";
import ImageGallery from "./components/ImageGallery";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
    const [token, setToken] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/"); 
    };

    return (
        <div>
            <GlobalStyles />
            <Navbar token={token} onLogout={handleLogout} />
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage token={token} />} />
                    <Route path="/login" element={<AuthForm title="Login" isLogin onLogin={handleLogin} />} />
                    <Route path="/register" element={<AuthForm title="Register" />} />
                    <Route
                        path="/upload"
                        element={token ? <ImageUpload token={token} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/gallery"
                        element={token ? <ImageGallery token={token} /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
