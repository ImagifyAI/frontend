import React, { useState, useEffect } from "react";
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
    const [turnstileToken, setTurnstileToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.onTurnstileLoad = () => {
            window.turnstile.render('#turnstile-widget', {
                sitekey: 'YOUR_SITE_KEY',
                callback: function(token) {
                    console.log("Turnstile token received");
                    setTurnstileToken(token);
                },
                'expired-callback': () => {
                    console.log("Turnstile token expired");
                    setTurnstileToken(null);
                },
                'error-callback': () => {
                    console.log("Turnstile error occurred");
                    setTurnstileToken(null);
                }
            });
        };

        return () => {
            window.onTurnstileLoad = null;
            const existingScript = document.querySelector(
                'script[src*="challenges.cloudflare.com/turnstile/v0/api.js"]'
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
            if (!turnstileToken) {
                setError("Please complete the security check");
                setIsLoading(false);
                return;
            }

            let response;
            if (isLogin) {
                response = await login(email, password, turnstileToken);
                if (response.data.success) {
                    onLogin(response.data.token);
                    navigate("/");
                } else {
                    setError("Invalid email or password");
                }
            } else {
                response = await register(email, password, turnstileToken);
                if (response.data.success) {
                    navigate("/login");
                } else {
                    setError("Registration failed");
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
                window.turnstile.reset('#turnstile-widget');
                setTurnstileToken(null);
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
                    <div id="turnstile-widget" />
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