import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SavedDreams() {
    const [dreams, setDreams] = useState([]);
    const [showCalendar, setShowCalendar] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredEmotion, setFilteredEmotion] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newDate, setNewDate] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [newEmotion, setNewEmotion] = useState("");

    const emotions = ["😊", "😢", "😡", "😱", "😴", "😇"];

    useEffect(() => {
        loadDreams();
    }, []);

    const loadDreams = () => {
        const stored = JSON.parse(localStorage.getItem("dreams") || "[]");
        setDreams(stored.reverse());
    };

    const deleteDream = (indexToDelete) => {
        const stored = JSON.parse(localStorage.getItem("dreams") || "[]").reverse();
        stored.splice(indexToDelete, 1);
        localStorage.setItem("dreams", JSON.stringify(stored.reverse()));
        loadDreams();
    };

    const saveEdits = (index) => {
        if (!newDate) {
            alert("Please select a date.");
            return;
        }
        const stored = JSON.parse(localStorage.getItem("dreams") || "[]").reverse();
        stored[index].timestamp = newDate.toISOString();
        stored[index].comment = newComment.trim();
        stored[index].emotion = newEmotion || "";
        localStorage.setItem("dreams", JSON.stringify(stored.reverse()));
        loadDreams();
        setEditingIndex(null);
        setNewDate(null);
        setNewComment("");
        setNewEmotion("");
    };

    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    const dreamDates = dreams.map(dream => {
        const date = new Date(dream.timestamp);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    });

    const dayClassName = (date) => {
        const isDreamDate = dreamDates.some(dreamDate =>
            dreamDate.getTime() === date.getTime()
        );
        return isDreamDate ? "dream-highlight" : undefined;
    };

    const filteredDreams = dreams.filter(dream => {
        const dreamDate = new Date(dream.timestamp);
        const dateMatch = selectedDate
            ? dreamDate.toDateString() === selectedDate.toDateString()
            : true;
        const emotionMatch = filteredEmotion
            ? dream.emotion === filteredEmotion
            : true;
        return dateMatch && emotionMatch;
    });

    return (
        <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif", color: "black" }}>
            <h1 style={{ textAlign: "center", fontSize: "3rem", marginBottom: "2rem", color: "white" }}>📚 Saved Dreams</h1>

            {/* 캘린더 + 이모티콘: 오른쪽 정렬 */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", gap: "1rem", marginBottom: "2rem" }}>
                {showCalendar && (
                    <div style={{ maxWidth: "200px", marginRight: "10px", transform: "translateX(-40px)" }}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dayClassName={dayClassName}
                            inline
                        />
                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate(null)}
                                style={{
                                    marginTop: "0.5rem",
                                    padding: "0.3rem 0.6rem",
                                    fontSize: "0.75rem",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    backgroundColor: "#ffe0e0",
                                    cursor: "pointer",
                                    width: "100%"
                                }}
                            >
                                ❌ Clear Date Filter
                            </button>
                        )}
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div>
                        {emotions.map((emo, i) => (
                            <button
                                key={i}
                                onClick={() => setFilteredEmotion(filteredEmotion === emo ? null : emo)}
                                style={{
                                    fontSize: "1.3rem",
                                    margin: "0.2rem",
                                    padding: "0.2rem 0.4rem",
                                    backgroundColor: filteredEmotion === emo ? "#d1c4e9" : "#f0f0f0",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                {emo}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        style={{
                            marginTop: "0.5rem",
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.85rem",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            backgroundColor: "#f0f0f0",
                            cursor: "pointer",
                            width: "100%"
                        }}
                    >
                        📅 {showCalendar ? "Hide Calendar" : "Show Calendar"}
                    </button>

                    {filteredEmotion && (
                        <button
                            onClick={() => setFilteredEmotion(null)}
                            style={{
                                marginTop: "0.5rem",
                                padding: "0.3rem 0.6rem",
                                fontSize: "0.75rem",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                backgroundColor: "#ffe0e0",
                                cursor: "pointer",
                                width: "100%"
                            }}
                        >
                            ❌ Clear Emotion Filter
                        </button>
                    )}
                </div>
            </div>

            {filteredDreams.length === 0 ? (
                <p style={{ textAlign: "center", color: "#666" }}>No dreams found for the selected filters.</p>
            ) : (
                filteredDreams.map((dream, idx) => (
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

                        <div style={{ flex: "1 1 60%", minWidth: "250px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <p><b>📅 Date:</b> {formatDate(dream.timestamp)}</p>
                                {editingIndex !== idx && (
                                    <button
                                        onClick={() => {
                                            setEditingIndex(idx);
                                            setNewDate(new Date(dream.timestamp));
                                            setNewComment(dream.comment || "");
                                            setNewEmotion(dream.emotion || "");
                                        }}
                                        style={{
                                            padding: "0.3rem 0.7rem",
                                            fontSize: "0.85rem",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            backgroundColor: "#f0f0f0",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                )}
                            </div>

                            <p><b>📝 Dream Input:</b><br />{dream.rawDream}</p>
                            <p><b>🔍 Final Interpretation:</b><br />{dream.final}</p>

                            {editingIndex === idx ? (
                                <>
                                    <DatePicker
                                        selected={newDate}
                                        onChange={(date) => setNewDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                    />

                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Edit your comment..."
                                        rows={3}
                                        style={{
                                            width: "100%",
                                            marginTop: "0.8rem",
                                            padding: "0.5rem",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc"
                                        }}
                                    />

                                    <div style={{ marginTop: "0.8rem" }}>
                                        <b>Select your emotion:</b><br />
                                        {emotions.map((emo, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setNewEmotion(emo)}
                                                style={{
                                                    fontSize: "1.4rem",
                                                    marginRight: "0.5rem",
                                                    padding: "0.3rem 0.5rem",
                                                    backgroundColor: newEmotion === emo ? "#d1c4e9" : "#f0f0f0",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "6px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {emo}
                                            </button>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: "0.5rem" }}>
                                        <button
                                            onClick={() => saveEdits(idx)}
                                            style={{
                                                marginRight: "0.5rem",
                                                padding: "0.4rem 0.8rem",
                                                backgroundColor: "#81c784",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingIndex(null);
                                                setNewDate(null);
                                                setNewComment("");
                                                setNewEmotion("");
                                            }}
                                            style={{
                                                padding: "0.4rem 0.8rem",
                                                backgroundColor: "#e0e0e0",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                dream.comment && (
                                    <p style={{ marginTop: "0.8rem", color: "#444" }}>
                                        <b>💬 Comment:</b><br />
                                        {dream.emotion ? `${dream.emotion} ` : ""}{dream.comment}
                                    </p>
                                )
                            )}
                        </div>

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
