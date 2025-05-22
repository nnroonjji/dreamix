import React, { useEffect, useState } from "react";
import { singularize } from "inflection";
import DreamImage from "./DreamImage";

function DreamResult({ result, selectedStyle, originalDream, onReset }) {
    const [symbolData, setSymbolData] = useState({});
    const [sceneIndex, setSceneIndex] = useState(0);

    useEffect(() => {
        console.log("🧠 GPT 응답:", result);

        if (result?.["Raw Response"]) {
            try {
                const recovered = JSON.parse(result["Raw Response"]);
                console.log("🧠 Re-parsed fallback JSON:", recovered);
            } catch (err) {
                console.error("❌ Re-parse failed:", err);
            }
        }
    }, [result]);

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

    const styleMap = {
        jungian: "j",
        modern: "m",
        general: "g"
    };

    const styleKey = styleMap[selectedStyle?.toLowerCase().trim()] || "g";
    const visualPrompt = result?.["Visual Prompt"]?.Description || null;
    const finalInterpretation = result?.["Final Interpretation"];

    const getInterpretedSymbols = (sceneValue) => {
        const symbols = sceneValue.Symbols?.map((s) =>
            singularize(s.toLowerCase().trim())
        ) || [];

        return symbols.map((symbol) => {
            const normalized = symbol.toLowerCase().trim();
            const meaning = symbolData[normalized];

            console.log("🔍 Symbol Raw:", symbol);
            console.log("🧩 Normalized:", normalized);
            console.log("📘 Matched meaning:", meaning);
            console.log("📂 Style key used:", styleKey);

            return { symbol: normalized, meaning };
        });
    };

    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2.5rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.6rem" }}>
                <span>🌙</span> <span style={{ fontWeight: "bold" }}>DreaMix</span>
            </h1>

            {originalDream && (
                <div style={{ backgroundColor: "#fff8e1", border: "1px solid #ffe0b2", padding: "1rem", borderRadius: "10px", marginBottom: "2rem" }}>
                    <h3>📝 Describe your dream</h3>
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>{originalDream}</p>
                </div>
            )}

            {scenes.length > 0 && (
                <div style={{ backgroundColor: "#fdfdfd", border: "1px solid #ddd", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem", boxShadow: "0 0 6px rgba(0,0,0,0.05)" }}>
                    <h3>{scenes[sceneIndex][0]}</h3>
                    <p><b>Scene Summary:</b> {scenes[sceneIndex][1].Summary}</p>
                    <p><b>Emotions:</b> {scenes[sceneIndex][1].Emotions?.join(", ")}</p>
                    <p><b>Interpretation:</b> {scenes[sceneIndex][1].Interpretation}</p>

                    <div style={{ marginTop: "1rem" }}>
                        <p><b>Symbolic Elements:</b></p>
                        <ul style={{ paddingLeft: "1.2rem" }}>
                            {getInterpretedSymbols(scenes[sceneIndex][1]).map(({ symbol, meaning }, idx) => (
                                <li key={idx}>
                                    <b>{symbol}:</b> {meaning?.[styleKey] || <span style={{ color: "crimson" }}>❌ Not found</span>}
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

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                <div style={{ flex: "1 1 0", minWidth: "280px" }}>
                    {finalInterpretation && (
                        <div style={{ padding: "1.5rem", border: "2px solid #aaa", backgroundColor: "#f5faff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                            <h3>🔍 Dream Decoder</h3>
                            <p style={{ fontSize: "1.05rem", lineHeight: "1.6" }}>{finalInterpretation}</p>
                        </div>
                    )}
                </div>
                <div style={{ flex: "1 1 0", minWidth: "280px" }}>
                    {visualPrompt && <DreamImage prompt={visualPrompt} />}
                </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button onClick={onReset} style={{ backgroundColor: "#f0f0f0", border: "1px solid #aaa", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" }}>
                    🔁 Interpret Another Dream
                </button>
            </div>
        </div>
    );
}

export default DreamResult;
