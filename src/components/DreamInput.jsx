import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

function DreamInput({ onResult, onStyleChange }) {
    const [dreamText, setDreamText] = useState("");
    const [style, setStyle] = useState("general");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            const raw = data.response;

            try {
              
                onResult(data.response);
            } catch (err) {
                console.error("❌ Failed to parse GPT JSON response:", raw);
                setError("❌ GPT 응답을 JSON으로 해석할 수 없습니다.");
                onResult({ "Raw Response": raw });
            }
        } catch (err) {
            setError("❌ 서버 연결 실패: Flask 서버가 실행 중인지 확인하세요.");
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div>
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
                    fontFamily: "inherit"
                }}
                placeholder="Describe your dream in English..."
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
            />

            {/* 🔮 스타일 선택 */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.5rem",
                flexWrap: "wrap",
                margin: "1.5rem 0"
            }}>
                <label style={{ fontWeight: "600", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    🔮 Choose your lens:
                </label>

                {["jungian", "modern", "general"].map(option => (
                    <label key={option} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "1rem",
                        cursor: "pointer"
                    }}>
                        <input
                            type="radio"
                            value={option}
                            checked={style === option}
                            onChange={() => {
                                setStyle(option);
                                onStyleChange(option);
                            }}
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                ))}
            </div>

            {/* 🌙 해석 버튼 */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                    onClick={handleInterpret}
                    disabled={loading}
                    style={{
                        backgroundColor: "#f3f0ff",
                        border: "1px solid #b9aef2",
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

            {/* 💬 에러 메시지 */}
            {error && <ErrorMessage message={error} />}
        </div>
    );
}

export default DreamInput;
