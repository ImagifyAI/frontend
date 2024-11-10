import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";
import Turnstile, { useTurnstile } from "react-turnstile";

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
        document.body.appendChild(script);

        window.onTurnstileLoad = () => {
            window.turnstile.render('#turnstile-widget', {
                sitekey: "0x4AAAAAAAznBW2ZnF8X7Wc5",
                callback: (token) => setTurnstileToken(token),
            });
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!turnstileToken) {
            setError("Please complete the turnstile challenge");
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
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <div id="turnstile-widget"></div>
                {error && <p>{error}</p>}
                <button type="submit">{title}</button>
            </form>
        </FormContainer>
    );
};

export default AuthForm;