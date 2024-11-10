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
    const [turnstileLoaded, setTurnstileLoaded] = useState(false);
    const turnstileRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (!document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
            script.async = true;
            script.defer = true;
            
            window.onTurnstileLoad = () => {
                setTurnstileLoaded(true);
            };

            document.head.appendChild(script);
        } else if (window.turnstile) {
            setTurnstileLoaded(true);
        }

        return () => {
            window.onTurnstileLoad = null;
        };
    }, []);

    useEffect(() => {
        if (turnstileLoaded && turnstileRef.current) {
            window.turnstile.render(turnstileRef.current, {
                sitekey: "0x4AAAAAAAznBW2ZnF8X7Wc5",
                callback: function(token) {
                    console.log("Turnstile token:", token);
                }
            });
        }
    }, [turnstileLoaded]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const token = await new Promise((resolve) => {
                if (!window.turnstile) {
                    resolve(null);
                    return;
                }
                const tokens = window.turnstile.getResponse();
                resolve(tokens ? tokens[0] : null);
            });

            if (!token) {
                setError("Please complete the security check");
                setIsLoading(false);
                return;
            }

            if (isLogin) {
                const response = await login(email, password, token);
                if (response.data.success) {
                    onLogin(response.data.token);
                    navigate("/");
                } else {
                    setError("Invalid email or password");
                }
            } else {
                const response = await register(email, password, token);
                if (response.data.success) {
                    navigate("/login");
                } else {
                    setError("Registration failed");
                }
            }
        } catch (error) {
            setError(
                isLogin 
                    ? "Login failed, please check your credentials" 
                    : "Registration failed, please try again"
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
                    <div ref={turnstileRef} />
                </TurnstileContainer>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Please wait" : title}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </FormContainer>
    );
};

export default AuthForm;