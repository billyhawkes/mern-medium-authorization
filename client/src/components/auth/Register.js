import React, { useState } from "react";
import axios from "axios";

export default function Register() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();

    // Register in DB & Login -> Homepage
    const register = async (e) => {
        e.preventDefault();

        try {
            const newUser = { username, email, password, passwordCheck };
            await axios.post(
                "http://localhost:5000/api/users/register",
                newUser
            );
        } catch (err) {}
    };

    // Form
    return (
        <form onSubmit={register}>
            <h2>Register</h2>
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
