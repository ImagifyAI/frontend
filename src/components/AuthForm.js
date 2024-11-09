import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";
import Turnstile from "react-turnstile"; 

const FormContainer = styled.div`
  /* Styles */
`;

const AuthForm = ({ title, isLogin, onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [turnstileToken, setTurnstileToken] = useState(""); 
    const navigate = useNavigate();

    const handleTurnstileChange = (token) => {
        setTurnstileToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!turnstileToken) { 
            setError("Please complete the captcha.");
            return;
        }

        const headers = { 'Content-Type': 'application/json', 'Turnstile-Token': turnstileToken };
        const response = await (isLogin ? login : register)({ email, password }, headers);

        if (response.success) {
            onLogin();
            navigate("/"); 
        } else {
            setError(response.error || "Authentication failed");
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <Turnstile 
                    sitekey="0x4AAAAAAAznBW2ZnF8X7Wc5" 
                    onVerify={handleTurnstileChange} 
                />
                <button type="submit">{title}</button>
            </form>
            {error && <p>{error}</p>}
        </FormContainer>
    );
};

export default AuthForm;
