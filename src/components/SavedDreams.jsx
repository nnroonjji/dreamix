import React, { useEffect, useState } from "react";

function SavedDreams() {
    const [dreams, setDreams] = useState([]);

    useEffect(() => {
        loadDreams();
    }, []);

    const loadDreams = () => {
        const stored = JSON.parse(localStorage.getItem("dreams") || "[]");
        setDreams(stored.reverse());
    };

    const deleteDream = (indexToDelete) => {
        const stored = JSON.parse(localStorage.getItem("dreams") || "[]").reverse();
        stored.splice(indexToDelete, 1); // 삭제
        localStorage.setItem("dreams", JSON.stringify(stored.reverse())); // 순서 복구
        loadDreams(); // 다시 로딩
    };

    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleDateString();
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>📚 Saved Dreams</h1>

            {dreams.length === 0 ? (
                <p style={{ textAlign: "center", color: "#666" }}>No saved dreams found.</p>
            ) : (
                dreams.map((dream, idx) => (
                    <div key={idx} style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1.5rem",
                        border: "1px solid #ddd",
                        padding: "1.5rem",
                        marginBottom: "2rem",
                        borderRadius: "12px",
                        backgroundColor: "#fcfcfc",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        position: "relative"
                    }}>
                        {/* 삭제 버튼 */}
                        <button onClick={() => deleteDream(idx)} style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            background: "#ffebee",
                            color: "#c62828",
                            border: "1px solid #e57373",
                            borderRadius: "6px",
                            padding: "0.4rem 0.7rem",
                            fontSize: "0.9rem",
                            cursor: "pointer"
                        }}>
                            🗑️ Delete
                        </button>

                        {/* 왼쪽 정보 */}
                        <div style={{ flex: "1 1 60%", minWidth: "250px" }}>
                            <p><b>📅 Date:</b> {formatDate(dream.timestamp)}</p>
                            <p><b>📝 Dream Input:</b><br />{dream.rawDream}</p>
                            <p><b>🔍 Final Interpretation:</b><br />{dream.final}</p>
                            {dream.comment && (
                                <p style={{ marginTop: "0.8rem", color: "#444" }}>
                                    <b>💬 Comment:</b><br />{dream.comment}
                                </p>
                            )}
                        </div>

                        {/* 오른쪽 이미지 */}
                        <div style={{ flex: "1 1 35%", minWidth: "200px", textAlign: "center" }}>
                            {dream.image ? (
                                <img
                                    src={dream.image}
                                    alt="Saved Dream"
                                    style={{
                                        width: "100%",
                                        maxWidth: "300px",
                                        borderRadius: "10px",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                                    }}
                                />
                            ) : (
                                <div style={{ color: "#999" }}>No image available</div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default SavedDreams;
