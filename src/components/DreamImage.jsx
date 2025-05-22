import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

function DreamImage({ prompt }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!prompt) return;

        const generateImage = async () => {
            setLoading(true);
            setError(null);
            setImageSrc(null);

            try {
                const response = await fetch("http://localhost:7860/sdapi/v1/txt2img", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        steps: 20,
                        cfg_scale: 7,
                        sampler_index: "Euler a",
                        width: 512,
                        height: 512
                    })
                });

                const data = await response.json();
                const base64 = data.images?.[0];

                if (base64) {
                    setImageSrc(`data:image/png;base64,${base64}`);
                } else {
                    setError("⚠️ 이미지 생성 실패: 응답에 이미지가 포함되어 있지 않습니다.");
                }
            } catch (err) {
                console.error("❌ 이미지 생성 오류:", err);
                setError("❌ Stable Diffusion 서버에 연결할 수 없습니다. (localhost:7860)");
            }

            setLoading(false);
        };

        generateImage();
    }, [prompt]);

    return (
        <div style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #e0e0e0",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)"
        }}>
            <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>🎨 Dream Image</h2>

            {loading && <LoadingSpinner text="🖼️ Painting the essence of your dream..." />}
            {error && <ErrorMessage message={error} />}

            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="Dream"
                    style={{
                        marginTop: "1rem",
                        maxWidth: "100%",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        display: "block"
                    }}
                />
            )}
        </div>
    );
}

export default DreamImage;
