import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";

const FormContainer = styled.div`
  /* Styles */
`;

const AuthForm = ({ title, isLogin, onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [turnstileToken, setTurnstileToken] = useState(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.onload = () => {
            if (window.turnstile) {
                window.turnstile.render(`#turnstile-widget-${isLogin ? 'login' : 'register'}`, {
                    sitekey: "0x4AAAAAAAznBW2ZnF8X7Wc5",
                    callback: (token) => setTurnstileToken(token),
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [isLogin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!turnstileToken) {
            setError("Please complete the Turnstile challenge");
            return;
        }

        try {
            const apiFunc = isLogin ? login : register;
            await apiFunc({ email, password, turnstileToken });
            navigate("/");
            onLogin && onLogin();
        } catch (error) {
            setError("Login or registration failed");
        }
    };

    return (
        <FormContainer>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* Use unique IDs for each page to avoid conflict */}
                <div id={`turnstile-widget-${isLogin ? 'login' : 'register'}`}></div>
                {error && <p>{error}</p>}
                <button type="submit">{title}</button>
            </form>
        </FormContainer>
    );
};

export default AuthForm;
