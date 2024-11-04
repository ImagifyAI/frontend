import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

const FormContainer = styled.div`
  /* Styles */
`;

const AuthForm = ({ title, isLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear any previous error

        try {
            const response = await login(email, password);

            // Check if login was successful
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                navigate("/"); // Redirect to the homepage
            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            setError("Login failed. Please check your credentials.");
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
