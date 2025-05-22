// src/components/ErrorMessage.jsx
import React from "react";

function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <div style={{
            backgroundColor: "#fff3f3",
            border: "1px solid #f5c2c7",
            color: "#842029",
            padding: "1rem",
            borderRadius: "10px",
            marginTop: "1rem",
            fontSize: "0.95rem"
        }}>
            <strong>⚠️ Oops!</strong> {message}
        </div>
    );
}

export default ErrorMessage;
