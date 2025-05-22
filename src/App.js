// App.js
import React, { useState } from "react";
import DreamInput from "./components/DreamInput";
import DreamResult from "./components/DreamResult";
import SavedDreams from "./components/SavedDreams";

function App() {
    const [result, setResult] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState("general");
    const [view, setView] = useState("input");
    const [hasResult, setHasResult] = useState(false);
    const [dreamImage, setDreamImage] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [promptUsed, setPromptUsed] = useState(null); // ✅ 중복 방지용 프롬프트

    const handleReset = () => {
        setResult(null);
        setHasResult(false);
        setView("input");
        setDreamImage(null);
        setImageLoaded(false);
        setPromptUsed(null);
    };

    const buttonStyle = {
        fontSize: "1rem",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "#f5f5f5",
        cursor: "pointer"
    };

    return (
        <div style={{ fontFamily: "sans-serif", minHeight: "100vh", padding: "0" }}>
            {view === "input" ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ marginTop: "4rem", marginBottom: "0.5rem" }}>
                        <h1 style={{ fontSize: "2.4rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <span>🌙</span> <span>DreaMix</span>
                        </h1>
                    </div>
                    <button onClick={() => setView("saved")} style={buttonStyle}>
                        📁 View Saved Dreams
                    </button>
                </div>
            ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #eee", backgroundColor: "#fafafa" }}>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>🌙</span> DreaMix
                    </h1>
                    {(view === "input" || view === "result") && (
                        <button onClick={() => setView("saved")} style={buttonStyle}>
                            📁 View Saved Dreams
                        </button>
                    )}
                    {view === "saved" && (
                        <button onClick={() => setView(hasResult ? "result" : "input")} style={buttonStyle}>
                            🔙 {hasResult ? "Back to Dream Result" : "Back to Dream Input"}
                        </button>
                    )}
                </div>
            )}

            {view === "input" && !result && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                    <div style={{ width: "100%", maxWidth: "600px", padding: "1rem" }}>
                        <DreamInput
                            onResult={(res) => {
                                setResult(res);
                                setHasResult(true);
                                setView("result");
                                setPromptUsed(res?.["Visual Prompt"]?.Description || null); // ✅ 설정
                            }}
                            onStyleChange={setSelectedStyle}
                        />
                    </div>
                </div>
            )}

            {view === "result" && result && (
                <DreamResult
                    result={result}
                    selectedStyle={selectedStyle}
                    onReset={handleReset}
                    dreamImage={dreamImage}
                    setDreamImage={setDreamImage}
                    imageLoaded={imageLoaded}
                    setImageLoaded={setImageLoaded}
                    promptUsed={promptUsed} // ✅ 전달
                />
            )}

            {view === "saved" && (
                <SavedDreams />
            )}
        </div>
    );
}

export default App;
