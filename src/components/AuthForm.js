import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";

const FormContainer = styled.div`
    /* Keep your existing styles */
`;

const TurnstileContainer = styled.div`
    margin: 20px 0;
    display: flex;
    justify-content: center;
`;

const AuthForm = ({ title, isLogin, onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const turnstileRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            const existingScript = document.querySelector(
                'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
            );
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const token = await new Promise((resolve) => {
                if (!window.turnstile) {
                    console.error("Turnstile not loaded");
                    resolve(null);
                    return;
                }
                console.log("Getting turnstile token");
                window.turnstile.ready(() => {
                    const token = window.turnstile.getResponse();
                    console.log("Turnstile token received:", token);
                    resolve(token);
                });
            });

            if (!token) {
                console.error("No turnstile token received");
                setError("Please complete the security check");
                setIsLoading(false);
                return;
            }

            console.log("Sending request with token:", token);

            if (isLogin) {
                const response = await login(email, password, token);
                console.log("Login response:", response);
                if (response.data.success) {
                    onLogin(response.data.token);
                    navigate("/");
                }
            } else {
                const response = await register(email, password, token);
                console.log("Register response:", response);
                if (response.data.success) {
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error("Request error:", error.response?.data || error);
            setError(
                error.response?.data?.error ||
                (isLogin
                    ? "Login failed, please check your credentials"
                    : "Registration failed, please try again")
            );
            if (window.turnstile) {
                window.turnstile.reset();
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormContainer>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <TurnstileContainer>
                    <div
                        id="turnstile-widget"
                        className="cf-turnstile"
                        data-sitekey="0x4AAAAAAAznBW2ZnF8X7Wc5"
                        data-callback="handleCallback"
                        data-theme="light"
                    />
                </TurnstileContainer>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Please wait..." : title}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </FormContainer>
    );
};

export default AuthForm;