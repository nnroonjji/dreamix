import React from "react";

function LoadingSpinner({ text }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1rem" }}>
            <div className="spinner" />
            {text && <span>{text}</span>}
            <style>
                {`
                    .spinner {
                        width: 18px;
                        height: 18px;
                        border: 3px solid #ccc;
                        border-top: 3px solid #333;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
}

export default LoadingSpinner;
