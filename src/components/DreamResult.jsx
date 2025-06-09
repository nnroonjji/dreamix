import React, { useEffect, useState, useRef } from "react";
import { singularize } from "inflection";
import DreamImage from "./DreamImage";

function DreamResult({
    result,
    selectedStyle,
    onReset,
    dreamImage,
    setDreamImage,
    imageLoaded,
    setImageLoaded,
    promptUsed,
    setView,
    setResult
}) {
    const [symbolData, setSymbolData] = useState({});
    const [sceneIndex, setSceneIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [emotion, setEmotion] = useState("");
    const previousPromptRef = useRef(null);

    const emotions = ["😊", "😢", "😡", "😱", "😴", "😇"];

    useEffect(() => {
        fetch("http://localhost:5000/symbol_data_50.json")
            .then((res) => res.json())
            .then((data) => {
                const normalized = {};
                for (const [key, value] of Object.entries(data)) {
                    normalized[key.toLowerCase().trim()] = value;
                }
                setSymbolData(normalized);
            })
            .catch((err) => {
                console.error("❌ Failed to load symbol data:", err);
            });
    }, []);

    const scenes = Object.entries(result || {})
        .filter(([key]) => key.toLowerCase().startsWith("scene"))
        .sort(([a], [b]) => a.localeCompare(b));

    const styleMap = { jungian: "j", modern: "m", general: "g" };
    const styleKey = styleMap[selectedStyle?.toLowerCase().trim()] || "g";
    const visualPrompt = result?.["Visual Prompt"]?.Description || null;
    const finalInterpretation = result?.["Final Interpretation"];

    useEffect(() => {
        if (
            visualPrompt &&
            previousPromptRef.current !== visualPrompt &&
            visualPrompt !== promptUsed
        ) {
            previousPromptRef.current = visualPrompt;
            setImageLoaded(false);
            setDreamImage(null);
        }
    }, [visualPrompt, promptUsed, setImageLoaded, setDreamImage]);

    const getInterpretedSymbols = (sceneValue) => {
        const symbols = sceneValue.Symbols?.map((s) => singularize(s.toLowerCase().trim())) || [];
        return symbols.map((symbol) => {
            const normalized = symbol.toLowerCase().trim();
            const meaning = symbolData[normalized];
            return { symbol: normalized, meaning };
        });
    };

    const regenerateVisualPrompt = async () => {
        try {
            const response = await fetch("http://localhost:5000/interpret", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dream: result["Raw Dream"],
                    style: selectedStyle
                })
            });

            const data = await response.json();
            setResult(data.response);      // 새로운 해석 + visual prompt
            setImageLoaded(false);
            setDreamImage(null);
        } catch (err) {
            console.error("Error regenerating visual prompt:", err);
        }
    };

    const handleSave = () => setShowModal(true);

    const confirmSave = () => {
        const stored = JSON.parse(localStorage.getItem("dreams") || "[]");
        const newDream = {
            timestamp: new Date().toISOString().split("T")[0],
            rawDream: result["Raw Dream"] || "Unknown",
            final: result["Final Interpretation"] || "No interpretation",
            image: dreamImage || "",
            comment: commentInput.trim(),
            emotion: emotion || ""
        };
        stored.push(newDream);
        localStorage.setItem("dreams", JSON.stringify(stored));
        setShowModal(false);
        setCommentInput("");
        setEmotion("");
        alert("💾 Dream saved successfully!");
    };

    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto", padding: "2rem", color: "black" }}>
            {/* 🌙 작은 로고 + 버튼 헤더 */}
            <header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem"
            }}>
                <div style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#FFEFB7",
                    textShadow: "0 0 5px rgba(255, 239, 183, 0.8)"
                }}>
                    <span role="img" aria-label="moon" style={{
                        fontSize: "2rem",
                        filter: "drop-shadow(0 0 5px rgba(255, 239, 183, 0.8))"
                    }}>
                        🌙
                    </span>
                    DreaMix
                </div>
                <button
                    onClick={() => setView("saved")}
                    style={{
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #aaa",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "1rem"
                    }}
                >
                    📁 View Saved Dreams
                </button>
            </header>

            {/* 📝 Dream Content */}
            {result?.["Raw Dream"] && (
                <div style={{
                    backgroundColor: "#fff8e1",
                    border: "1px solid #ffe0b2",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "10px",
                    marginBottom: "1.5rem"
                }}>
                    <div style={{ fontWeight: "bold", fontSize: "1.05rem", marginBottom: "0.3rem" }}>📝 Your dream</div>
                    <div style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>{result["Raw Dream"]}</div>
                </div>
            )}

            {/* Scene and Image */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 60%", maxWidth: "600px" }}>
                    {scenes.length > 0 && (
                        <div style={{
                            backgroundColor: "#fdfdfd",
                            border: "1px solid #ddd",
                            padding: "1.5rem",
                            borderRadius: "10px",
                            marginBottom: "2rem",
                            boxShadow: "0 0 6px rgba(0,0,0,0.05)"
                        }}>
                            <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>{`# ${scenes[sceneIndex][0]}`}</h3>

                            <div style={{ marginBottom: "0.6rem" }}>
                                <div style={{ fontWeight: "bold" }}>Scene Summary</div>
                                <div>{scenes[sceneIndex][1].Summary}</div>
                            </div>

                            <div style={{ marginBottom: "0.6rem" }}>
                                <div style={{ fontWeight: "bold" }}>Emotions</div>
                                <div>{scenes[sceneIndex][1].Emotions?.join(", ")}</div>
                            </div>

                            <div style={{ marginBottom: "0.6rem" }}>
                                <div style={{ fontWeight: "bold" }}>Interpretation</div>
                                <div>{scenes[sceneIndex][1].Interpretation}</div>
                            </div>

                            <div style={{ marginTop: "1rem" }}>
                                <div style={{ fontWeight: "bold" }}>Symbolic Elements</div>
                                <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
                                    {getInterpretedSymbols(scenes[sceneIndex][1]).map(({ symbol, meaning }, idx) => (
                                        <li key={idx}>
                                            <b>{symbol}:</b>{" "}
                                            {meaning?.[styleKey] || <span style={{ color: "crimson" }}>❌ Not found</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                                <button onClick={() => setSceneIndex((sceneIndex - 1 + scenes.length) % scenes.length)}>⬅ Prev</button>
                                <span style={{ margin: "0 1rem" }}>Scene {sceneIndex + 1} of {scenes.length}</span>
                                <button onClick={() => setSceneIndex((sceneIndex + 1) % scenes.length)}>Next ➡</button>
                            </div>
                        </div>
                    )}

                    {finalInterpretation && (
                        <div style={{
                            padding: "1.5rem",
                            border: "2px solid #aaa",
                            backgroundColor: "#f5faff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                        }}>
                            <h3>🔍 Dream Decoder</h3>
                            <p style={{ fontSize: "1.05rem", lineHeight: "1.6" }}>{finalInterpretation}</p>
                        </div>
                    )}
                </div>

                <div style={{ flex: "1 1 30%", minWidth: "280px" }}>
                    {visualPrompt && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <DreamImage
                                prompt={visualPrompt}
                                imageSrc={dreamImage}
                                setImageSrc={setDreamImage}
                                imageLoaded={imageLoaded}
                                setImageLoaded={setImageLoaded}
                            />

                            <button
                                onClick={regenerateVisualPrompt}
                                style={{
                                    marginTop: "0.8rem",
                                    padding: "0.5rem 1rem",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                    display: "block",
                                    width: "100%"
                                }}
                            >
                                🔄 Regenerate Image
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reset & Save Buttons */}
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button onClick={onReset} style={{
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #aaa",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    marginRight: "1rem"
                }}>
                    🔁 Interpret Another Dream
                </button>
                <button onClick={handleSave} style={{
                    backgroundColor: "#e8f5e9",
                    border: "1px solid #81c784",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem"
                }}>
                    💾 Save this dream
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)", display: "flex",
                    justifyContent: "center", alignItems: "center", zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: "white", padding: "2rem", borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)", maxWidth: "400px", width: "90%"
                    }}>
                        <h3 style={{ marginTop: 0 }}>💬 Leave a comment</h3>
                        <textarea
                            rows={4}
                            style={{ width: "100%", padding: "0.8rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Write your thoughts about this dream..."
                        />

                        <div style={{ marginTop: "1rem" }}>
                            <b>Select your emotion:</b><br />
                            {emotions.map((emo, i) => (
                                <button
                                    key={i}
                                    onClick={() => setEmotion(emo)}
                                    style={{
                                        fontSize: "1.4rem",
                                        marginRight: "0.5rem",
                                        padding: "0.3rem 0.5rem",
                                        backgroundColor: emotion === emo ? "#d1c4e9" : "#f0f0f0",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    }}
                                >
                                    {emo}
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: "1rem", textAlign: "right" }}>
                            <button onClick={() => setShowModal(false)} style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}>Cancel</button>
                            <button onClick={confirmSave} style={{ backgroundColor: "#81c784", color: "white", padding: "0.5rem 1.2rem", border: "none", borderRadius: "6px" }}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DreamResult;
