import React from "react";
import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({ msg, clearError }) {
    return (
        <div className={styles.error}>
            {msg}
            <button onClick={clearError} className={styles.exit}>
                X
            </button>
        </div>
    );
}
