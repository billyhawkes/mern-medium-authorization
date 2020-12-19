import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext.js";
import styles from "./Header.module.css";

export default function Header() {
    const { user, setUser } = useContext(UserContext);

    const logout = () => {
        setUser({
            token: undefined,
            user: {},
        });
        localStorage.setItem("auth-token", "");
    };

    return (
        <header className={styles.header}>
            <h1>Authorization</h1>
            <nav className={styles.nav}>
                {user.user.id ? (
                    <Link className={styles.link} onClick={logout} to="/">
                        Logout
                    </Link>
                ) : (
                    <>
                        <Link to="/register" className={styles.link}>
                            Register
                        </Link>
                        <Link to="/login" className={styles.link}>
                            Login
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
