// DreamResult.jsx
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
    promptUsed // ✅ 추가
}) {
    const [symbolData, setSymbolData] = useState({});
    const [sceneIndex, setSceneIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const previousPromptRef = useRef(null); // ✅ 중복 생성을 막기 위한 참조

    useEffect(() => {
        fetch("/symbol_data_50.json")
            .then((res) => res.json())
            .then((data) => {
                const normalized = {};
                for (const [key, value] of Object.entries(data)) {
                    normalized[key.toLowerCase().trim()] = value;
                }
                setSymbolData(normalized);
            });
    }, []);

    const scenes = Object.entries(result || {})
        .filter(([key]) => key.toLowerCase().startsWith("scene"))
        .sort(([a], [b]) => a.localeCompare(b));

    const styleMap = { jungian: "j", modern: "m", general: "g" };
    const styleKey = styleMap[selectedStyle?.toLowerCase().trim()] || "g";
    const visualPrompt = result?.["Visual Prompt"]?.Description || null;
    const finalInterpretation = result?.["Final Interpretation"];

    // ✅ 이미지 중복 생성 방지 로직
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

    const handleSave = () => setShowModal(true);

    const confirmSave = () => {
        const stored = JSON.parse(localStorage.getItem("dreams") || "[]");
        const newDream = {
            timestamp: new Date().toISOString().split("T")[0],
            rawDream: result["Raw Dream"] || "Unknown",
            final: result["Final Interpretation"] || "No interpretation",
            image: dreamImage || "",
            comment: commentInput.trim()
        };
        stored.push(newDream);
        localStorage.setItem("dreams", JSON.stringify(stored));
        setShowModal(false);
        setCommentInput("");
        alert("💾 Dream saved successfully!");
    };

    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
            {result?.["Raw Dream"] && (
                <div style={{
                    backgroundColor: "#fff8e1",
                    border: "1px solid #ffe0b2",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "10px",
                    marginBottom: "1rem"
                }}>
                    <div style={{ fontWeight: "bold", fontSize: "1.05rem", marginBottom: "0.3rem" }}>📝 Describe your dream</div>
                    <div style={{ fontSize: "0.95rem", lineHeight: "1.4" }}>{result["Raw Dream"]}</div>
                </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
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
                        <DreamImage
                            prompt={visualPrompt}
                            imageSrc={dreamImage}
                            setImageSrc={setDreamImage}
                            imageLoaded={imageLoaded}
                            setImageLoaded={setImageLoaded}
                        />
                    )}
                </div>
            </div>

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