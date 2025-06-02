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
        <div style={{
            fontFamily: "sans-serif",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",   // 🌙 중앙 정렬
            backgroundColor: "#2c2f4a",
            color: "#f5f5f5",
            padding: "2rem"
        }}>
            {/* 헤더 */}
            {view === "input" && (
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{
                        fontSize: "3.5rem",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        color: "#fceabb",
                        textShadow: "0 0 8px rgba(255, 255, 255, 0.4)",
                        marginLeft: "-20px"
                    }}>
                        <span>🌙</span> <span>DreaMix</span>
                    </h1>
                    <button onClick={() => setView("saved")} style={buttonStyle}>
                        📁 View Saved Dreams
                    </button>
                </div>
            )}

            {/* DreamInput 화면 */}
            {view === "input" && !result && (
                <div style={{ width: "100%", maxWidth: "600px" }}>
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
            )}

            {/* DreamResult 화면 */}
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
                    setView={setView}
                />
            )}

            {/* SavedDreams 화면 */}
            {view === "saved" && (
                <div style={{ width: "100%", maxWidth: "900px", padding: "1rem" }}>
                    <SavedDreams />
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <button onClick={() => setView(hasResult ? "result" : "input")} style={buttonStyle}>
                            🔙 {hasResult ? "Back to Dream Result" : "Back to Dream Input"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
