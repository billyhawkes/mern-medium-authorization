import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

// Components
import Register from "./components/auth/Register";
import Header from "./components/default/Header";
import Login from "./components/auth/Login";

// User Context
import UserContext from "./components/auth/UserContext";
import Axios from "axios";

export default function App() {
    const [user, setUser] = useState({
        token: undefined,
        user: {},
    });

    // On Startup
    useEffect(() => {
        const loginStart = async () => {
            // Get token
            let token = localStorage.getItem("auth-token");
            // Initial token setup
            if (token === null) return localStorage.setItem("auth-token", "");

            // Validates token
            const validatedToken = await Axios.post(
                "http://localhost:5000/api/users/validToken",
                null,
                { headers: { "auth-token": token } }
            );

            // If data, get user data
            if (validatedToken.data) {
                const userData = await Axios.get(
                    "http://localhost:5000/api/users/",
                    { headers: { "auth-token": token } }
                );
                console.log(userData);
                // Set user in state
                setUser({
                    token,
                    user: userData.data,
                });
            }
        };
        loginStart();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <Header></Header>
                <div className="container">
                    <Switch>
                        <Route path="/" exact>
                            {user.user.username ? (
                                <h2>Welcome, {user.user.username}</h2>
                            ) : (
                                <h2>Please Login/Register</h2>
                            )}
                        </Route>
                        <Route path="/register">
                            <Register></Register>
                        </Route>
                        <Route path="/login">
                            <Login></Login>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </UserContext.Provider>
    );
}
