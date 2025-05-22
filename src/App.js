import React, { useState } from "react";
import DreamInput from "./components/DreamInput";
import DreamResult from "./components/DreamResult";

function App() {
    const [result, setResult] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState("general");
    const [originalDream, setOriginalDream] = useState("");

    const handleReset = () => {
        setResult(null);
        setOriginalDream("");
    };

    return (
        <div style={{ fontFamily: "sans-serif", minHeight: "100vh" }}>
            {!result && (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    padding: "2rem",
                    boxSizing: "border-box"
                }}>
                    <h1 style={{
                        fontSize: "2.2rem",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem"
                    }}>
                        <span>🌙</span> <span style={{ fontWeight: "bold" }}>DreaMix</span>
                    </h1>

                    <div style={{ maxWidth: "600px", width: "100%" }}>
                        <DreamInput
                            onResult={setResult}
                            onStyleChange={setSelectedStyle}
                            onDreamText={setOriginalDream}
                        />
                    </div>
                </div>
            )}

            {result && (
                <DreamResult
                    result={result}
                    selectedStyle={selectedStyle}
                    originalDream={originalDream}
                    onReset={handleReset} // 🔁 버튼은 DreamResult 내부에서만 표시됨
                />
            )}
        </div>
    );
}

export default App;
