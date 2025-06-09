import React, { useState } from "react";

function ChatBot() {
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const updatedHistory = [...chatHistory, { role: "user", text: userInput }];
        setChatHistory(updatedHistory);
        setUserInput("");
        setLoading(true);

        const storedDreams = JSON.parse(localStorage.getItem("dreams") || "[]");
        const dreamSummary = storedDreams.map((d, i) => `
${i + 1}. Date: ${d.timestamp}
   Raw Dream: ${d.rawDream}
   Final Interpretation: ${d.final}
   Comment: ${d.comment || "None"}
   Emotion: ${d.emotion || "None"}
`).join("\n");

        const prompt = `
You are a compassionate dream analyst and therapist.

Your task:
- Provide a **concise insight** that combines the user's psychological state and emotions into **one sentence**.
- Offer warm, supportive advice in 1-2 short bullet points.
- Keep the response **brief and clear**: maximum 3 lines total.
- Use a warm, caring, non-judgmental tone like a therapist.

Response format:

🧠 Insight & Emotional Summary (1 sentence)

🌱 Advice (up to 2 short bullet points)

Dream Records:
${dreamSummary}
(These are the dreams the user had during the requested period.)

User Request:
${userInput}


`;

        try {
            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "mistral",
                    prompt: prompt,
                    stream: false
                })
            });

            const data = await response.json();
            const aiReply = data.response?.trim() || "Sorry, I couldn't generate a response.";

            setChatHistory(prev => [...prev, { role: "bot", text: aiReply }]);
        } catch (error) {
            console.error("❌ Error:", error);
            setChatHistory(prev => [...prev, { role: "bot", text: "Error: Unable to connect to the server." }]);
        }

        setLoading(false);
    };

    return (
        <div style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1rem",
            width: "100%",
            maxWidth: "350px",
            backgroundColor: "#f9f9f9",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative"
        }}>
            <div style={{ overflowY: "auto", flex: 1, marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {chatHistory.length === 0 ? (
                    <p style={{ color: "#666" }}>💬 Ask me about your dreams! I can analyze your mood, emotions, and give advice.</p>
                ) : (
                    chatHistory.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.role === "user" ? "#cce5ff" : "#fce4ec",
                            color: "#333",
                            padding: "0.6rem 1rem",
                            borderRadius: "12px",
                            maxWidth: "80%",
                            whiteSpace: "pre-wrap",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
                        }}>
                            {msg.text}
                        </div>
                    ))
                )}

                {loading && (
                    <div style={{
                        alignSelf: "flex-start",
                        backgroundColor: "#fce4ec",
                        padding: "0.6rem 1rem",
                        borderRadius: "12px",
                        maxWidth: "80%",
                        fontStyle: "italic",
                        color: "#666",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
                    }}>
                        DreamBot is typing...
                    </div>
                )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    type="text"
                    placeholder="Type your request..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#81c784",
                        color: "white",
                        cursor: "pointer"
                    }}
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}

export default ChatBot;
