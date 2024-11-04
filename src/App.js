import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AuthForm from "./components/AuthForm";
import ImageUpload from "./components/ImageUpload";
import ImageGallery from "./components/ImageGallery";
import { login, register } from "./api";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
    const [token, setToken] = useState(null);

    const handleLogin = async (email, password) => {
        try {
            const response = await login(email, password);
            setToken(response.data.token);
        } catch (error) {
            alert("Login failed");
        }
    };

    const handleRegister = async (email, password) => {
        try {
            await register(email, password);
            alert("Registration successful, please log in.");
        } catch (error) {
            alert("Registration failed");
        }
    };

    return (
        <Router>
            <GlobalStyles />
            <Navbar token={token} />
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage token={token} />} />
                    <Route path="/login" element={<AuthForm onSubmit={handleLogin} title="Login" isLogin />} />
                    <Route path="/register" element={<AuthForm onSubmit={handleRegister} title="Register" />} />
                    <Route path="/upload" element={token ? <ImageUpload token={token} onUpload={() => window.location.reload()} /> : <p>Please log in to upload an image.</p>} />
                    <Route path="/gallery" element={token ? <ImageGallery token={token} /> : <p>Please log in to view the gallery.</p>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
