import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

function DreamInput({ onResult, onStyleChange }) {
    const [dreamText, setDreamText] = useState("");
    const [style, setStyle] = useState("general");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const styleDescriptions = {
        jungian: "Looks at dreams as messages from the deep mind using symbols and universal ideas.",
        modern: "Explains dreams by connecting them to your feelings and daily life.",
        general: "Gives simple meanings to dream symbols based on common ideas and culture."
    };

    const handleInterpret = async () => {
        if (!dreamText.trim()) {
            setError("Please enter your dream before decoding it.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:5000/interpret", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dream: dreamText,
                    style: style
                })
            });

            const data = await response.json();
            onResult(data.response);
        } catch (err) {
            setError("❌ Server connection failed. Please check if the Flask server is running.");
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div>
            {/* Dream Text Input */}
            <textarea
                rows="6"
                style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1rem",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    outline: "none",
                    boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
                    resize: "vertical",
                    fontFamily: "inherit",
                    marginBottom: "1.5rem"
                }}
                placeholder="Describe your dream ..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
            />

            {/* 🔮 Choose Your Lens */}
            <div style={{
                textAlign: "center",
                marginBottom: "0.6rem",
                fontWeight: "600",
                fontSize: "1rem",
                color: "#fceabb",
                textShadow: "0 0 5px rgba(255, 255, 255, 0.4)"
            }}>
                🔮 Choose your lens 🔮
            </div>

            {/* Style Selection Buttons */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1rem"
            }}>
                {["jungian", "modern", "general"].map(option => (
                    <button
                        key={option}
                        onClick={() => {
                            setStyle(option);
                            onStyleChange(option);
                        }}
                        style={{
                            backgroundColor: style === option ? "#857bd1" : "#c5c5c5",
                            color: style === option ? "#f5f5f5" : "#2c2f4a",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {/* 📖 Style Description Box */}
            <div style={{
                backgroundColor: "#4b4377",
                borderRadius: "10px",
                padding: "1rem",
                maxWidth: "600px",
                margin: "0 auto 1.5rem",
                color: "#f5f5f5",
                fontSize: "0.95rem",
                textAlign: "center",   // 🌸 가운데 정렬
                lineHeight: "1.4"
            }}>
                <p>{styleDescriptions[style]}</p>
            </div>

            {/* 🌙 Begin the Dream Reading Button */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                    onClick={handleInterpret}
                    disabled={loading}
                    style={{
                        backgroundColor: "#f3f0ff",
                        border: "none",
                        padding: "0.8rem 1.4rem",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                        transition: "background 0.2s ease"
                    }}
                >
                    {loading
                        ? <LoadingSpinner text="🌌 Decoding the language of your dream..." />
                        : <>🌙 Begin the dream reading</>}
                </button>
            </div>

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}
        </div>
    );
}

export default DreamInput;
