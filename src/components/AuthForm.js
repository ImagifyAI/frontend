import React, { useState } from "react";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            let response;
            if (isLogin) {
                response = await login(email, password);
                if (response.data.success) {
                    onLogin(response.data.token);
                    navigate("/");
                } else {
                    setError("Invalid email or password");
                }
            } else {
                response = await register(email, password);
                if (response.data.success) {
                    navigate("/login");
                } else {
                    setError("Registration failed");
                }
            }
        } catch (error) {
            setError(isLogin ? "Login failed, please check your credentials" : "Registration failed, please try again");
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
                <button type="submit">{title}</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </FormContainer>
    );
};

export default AuthForm;
