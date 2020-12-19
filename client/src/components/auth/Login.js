import React, { useState, useContext } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const { setUser } = useContext(UserContext);
    const history = useHistory();

    const login = async (e) => {
        e.preventDefault();

        // Gets User Data
        const loginRes = await axios.post(
            "http://localhost:5000/api/users/login",
            {
                email,
                password,
            }
        );
        // Sets User Context
        setUser({ token: loginRes.data.token, user: loginRes.data.user });
        // Sets JWT in Localstorage
        localStorage.setItem("auth-token", loginRes.data.token);
        history.push("/");
    };

    return (
        <form onSubmit={login}>
            <h2>Login</h2>
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
            <input type="submit"></input>
        </form>
    );
}
