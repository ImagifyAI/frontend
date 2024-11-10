import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";

const FormContainer = styled.div`
    /* Styles */
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
            const turnstileToken = await new Promise((resolve) => {
                turnstileRef.current.getTurnstileToken((token) => {
                    resolve(token);
                });
            });

            if (!turnstileToken) {
                setError("Please complete the security check");
                setIsLoading(false);
                return;
            }

            if (isLogin) {
                const response = await login(email, password, turnstileToken);
                if (response.data.success) {
                    onLogin(response.data.token);
                    navigate("/");
                } else {
                    setError("Invalid email or password");
                }
            } else {
                const response = await register(email, password, turnstileToken);
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
            if (turnstileRef.current) {
                window.turnstile.reset(turnstileRef.current);
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
                        className="cf-turnstile"
                        data-sitekey="YOUR_TURNSTILE_SITE_KEY"
                        data-callback="handleCallback"
                        ref={(ref) => {
                            turnstileRef.current = ref;
                            if (ref && !ref.hasAttribute('data-loaded')) {
                                ref.setAttribute('data-loaded', 'true');
                                window.turnstile.render(ref);
                            }
                        }}
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