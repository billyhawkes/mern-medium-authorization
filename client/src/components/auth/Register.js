import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ErrorMessage from "../default/ErrorMessage";
import UserContext from "./UserContext";

export default function Register() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [error, setError] = useState();

    const history = useHistory();

    const { setUser } = useContext(UserContext);
    // Register in DB & Login -> Homepage
    const register = async (e) => {
        e.preventDefault();

        try {
            const newUser = { username, email, password, passwordCheck };
            await axios.post(
                "http://localhost:5000/api/users/register",
                newUser
            );

            const loginRes = await axios.post(
                "http://localhost:5000/api/users/login",
                { email, password }
            );
            setUser({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            localStorage.setItem("auth-token", loginRes.data.token);
            history.push("/");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    // Form
    return (
        <form onSubmit={register}>
            <h2>Register</h2>
            {error && (
                <ErrorMessage
                    msg={error}
                    clearError={() => setError()}
                ></ErrorMessage>
            )}
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Verify Password"
                onChange={(e) => setPasswordCheck(e.target.value)}
            />
            <input type="submit"></input>
        </form>
    );
}
