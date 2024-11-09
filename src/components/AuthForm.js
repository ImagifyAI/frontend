import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { register, login } from "../api";
import Turnstile from "react-turnstile"; 

const FormContainer = styled.div`
  /* Styles */
`;

const AuthForm = ({ title, isLogin, onLogin = () => {} }) => {  
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
            setError("Please complete the captcha");
            return;
        }
    
        const headers = { 'Turnstile-Token': turnstileToken };
        console.log("Turnstile Token:", turnstileToken); 
    
        try {
            const response = isLogin 
                ? await login(email, password, headers) 
                : await register(email, password, headers);

            console.log("Backend response:", response.data); 
            if (response.data.success) {
                if (isLogin && response.data.token) {
                    localStorage.setItem("authToken", response.data.token);
                }

                if (typeof onLogin === "function") { 
                    onLogin();
                }
                navigate("/"); 
            } else {
                setError(response.data.error || "Authentication failed");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Backend responded with an error:", error.response.data);
                setError(error.response.data.error || "Authentication failed");
            } else {
                console.error("Error during submission:", error);
                setError("Submission failed");
            }
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
