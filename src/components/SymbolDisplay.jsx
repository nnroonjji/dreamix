import React from "react";

function SymbolDisplay({ symbols, selectedStyle }) {
    if (!symbols || symbols.length === 0) return null;

    const styleKey = selectedStyle?.toLowerCase().trim();

    return (
        <div style={{ marginTop: "2rem" }}>
            <h2>📚 Symbol Interpretations</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                {symbols.map(({ symbol, meaning }, index) => {
                    const hasMeaning = meaning && styleKey in meaning;

                    return (
                        <div
                            key={`${symbol}-${index}`}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "1rem",
                                backgroundColor: hasMeaning ? "#fff" : "#fce8e6",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                            }}
                        >
                            <h4 style={{ marginBottom: "0.5rem" }}>🔹 {symbol}</h4>
                            {hasMeaning ? (
                                <p>
                                    <b>{styleKey.charAt(0).toUpperCase() + styleKey.slice(1)}:</b>{" "}
                                    {meaning[styleKey]}
                                </p>
                            ) : (
                                <p style={{ color: "crimson" }}>❌ No interpretation found.</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SymbolDisplay;
